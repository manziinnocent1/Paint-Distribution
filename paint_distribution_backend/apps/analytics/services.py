
import uuid

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from .models import (
    DashboardSnapshot,
    ReportExecution,
)


@transaction.atomic
def save_dashboard_snapshot(
    *,
    title,
    snapshot_type,
    period_start,
    period_end,
    metrics,
    generated_by=None,
    currency="RWF",
    source_metadata=None,
    notes="",
):
    """
    Create or update a dashboard snapshot.

    Financial values in metrics should be serialized as strings.
    """

    if not isinstance(metrics, dict):
        raise ValidationError(
            "Dashboard metrics must be a dictionary."
        )

    if period_end < period_start:
        raise ValidationError(
            "The reporting end date cannot precede its start date."
        )

    snapshot, created = (
        DashboardSnapshot.objects.update_or_create(
            snapshot_type=snapshot_type,
            period_start=period_start,
            period_end=period_end,
            defaults={
                "title": title,
                "currency": currency,
                "metrics": metrics,
                "source_metadata": source_metadata or {},
                "notes": notes,
                "generated_by": generated_by,
                "generated_at": timezone.now(),
            },
        )
    )

    return snapshot, created


@transaction.atomic
def create_report_execution(
    *,
    report_type,
    title,
    requested_by=None,
    description="",
    parameters=None,
):
    """
    Register a new report generation request.

    A background worker will process the report in a later phase.
    """

    return ReportExecution.objects.create(
        report_number=(
            f"RPT-{uuid.uuid4().hex[:12].upper()}"
        ),
        report_type=report_type,
        title=title,
        description=description,
        parameters=parameters or {},
        requested_by=requested_by,
        status=ReportExecution.Status.PENDING,
    )


@transaction.atomic
def start_report_execution(report):
    """
    Mark a pending report as running.
    """

    report = ReportExecution.objects.select_for_update().get(
        pk=report.pk
    )

    if report.status != ReportExecution.Status.PENDING:
        raise ValidationError(
            "Only pending reports can be started."
        )

    report.status = ReportExecution.Status.RUNNING
    report.started_at = timezone.now()
    report.error_message = ""

    report.save(
        update_fields=[
            "status",
            "started_at",
            "error_message",
            "updated_at",
        ]
    )

    return report


@transaction.atomic
def complete_report_execution(
    report,
    *,
    output_file=None,
    row_count=0,
    expires_at=None,
):
    """
    Mark a report as completed.
    """

    report = ReportExecution.objects.select_for_update().get(
        pk=report.pk
    )

    if report.status != ReportExecution.Status.RUNNING:
        raise ValidationError(
            "Only running reports can be completed."
        )

    if output_file is not None:
        report.output_file = output_file

    report.status = ReportExecution.Status.COMPLETED
    report.row_count = row_count
    report.completed_at = timezone.now()
    report.expires_at = expires_at

    report.save(
        update_fields=[
            "output_file",
            "status",
            "row_count",
            "completed_at",
            "expires_at",
            "updated_at",
        ]
    )

    return report


@transaction.atomic
def fail_report_execution(report, error_message):
    """
    Record a report generation failure.
    """

    report = ReportExecution.objects.select_for_update().get(
        pk=report.pk
    )

    if report.status != ReportExecution.Status.RUNNING:
        raise ValidationError(
            "Only running reports can be marked as failed."
        )

    report.status = ReportExecution.Status.FAILED
    report.error_message = str(error_message)
    report.completed_at = timezone.now()

    report.save(
        update_fields=[
            "status",
            "error_message",
            "completed_at",
            "updated_at",
        ]
    )

    return report
