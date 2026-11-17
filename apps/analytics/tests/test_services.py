
import pytest

from datetime import date

from django.core.exceptions import ValidationError

from apps.analytics.models import (
    DashboardSnapshot,
    ReportExecution,
)

from apps.analytics.services import (
    save_dashboard_snapshot,
    create_report_execution,
    start_report_execution,
    complete_report_execution,
    fail_report_execution,
)


@pytest.mark.django_db
class TestDashboardSnapshotServices:

    def test_create_snapshot_using_service(self):

        snapshot, created = save_dashboard_snapshot(
            title="October Performance",
            snapshot_type="monthly",
            period_start=date(2026, 10, 1),
            period_end=date(2026, 10, 31),
            metrics={
                "total_sales": "15000000.00",
            },
        )

        assert created is True

        assert snapshot.title == "October Performance"

        assert snapshot.metrics["total_sales"] == (
            "15000000.00"
        )

    def test_update_existing_snapshot(self):

        first, created = save_dashboard_snapshot(
            title="October Performance",
            snapshot_type="monthly",
            period_start=date(2026, 10, 1),
            period_end=date(2026, 10, 31),
            metrics={
                "total_sales": "1000000.00",
            },
        )

        second, created_again = save_dashboard_snapshot(
            title="Updated October Performance",
            snapshot_type="monthly",
            period_start=date(2026, 10, 1),
            period_end=date(2026, 10, 31),
            metrics={
                "total_sales": "2000000.00",
            },
        )

        assert created is True
        assert created_again is False

        assert first.id == second.id

        assert second.metrics["total_sales"] == (
            "2000000.00"
        )

        assert DashboardSnapshot.objects.count() == 1

    def test_invalid_metrics_are_rejected(self):

        with pytest.raises(ValidationError):

            save_dashboard_snapshot(
                title="Invalid Report",
                snapshot_type="monthly",
                period_start=date(2026, 10, 1),
                period_end=date(2026, 10, 31),
                metrics=["invalid"],
            )

    def test_invalid_dates_are_rejected(self):

        with pytest.raises(ValidationError):

            save_dashboard_snapshot(
                title="Invalid Report",
                snapshot_type="monthly",
                period_start=date(2026, 10, 31),
                period_end=date(2026, 10, 1),
                metrics={},
            )


@pytest.mark.django_db
class TestReportExecutionServices:

    def test_create_report_request(self):

        report = create_report_execution(
            report_type="sales",
            title="Monthly Sales Report",
            parameters={
                "period": "October 2026",
            },
        )

        assert report.status == "pending"

        assert report.report_number.startswith("RPT-")

    def test_start_report(self):

        report = create_report_execution(
            report_type="inventory",
            title="Inventory Report",
        )

        report = start_report_execution(report)

        assert report.status == "running"

        assert report.started_at is not None

    def test_complete_report(self):

        report = create_report_execution(
            report_type="sales",
            title="Sales Report",
        )

        report = start_report_execution(report)

        report = complete_report_execution(
            report,
            row_count=150,
        )

        assert report.status == "completed"

        assert report.row_count == 150

        assert report.completed_at is not None

    def test_fail_report(self):

        report = create_report_execution(
            report_type="financial",
            title="Financial Report",
        )

        report = start_report_execution(report)

        report = fail_report_execution(
            report,
            "Unable to generate report.",
        )

        assert report.status == "failed"

        assert report.error_message == (
            "Unable to generate report."
        )

    def test_pending_report_cannot_be_completed(self):

        report = create_report_execution(
            report_type="sales",
            title="Sales Report",
        )

        with pytest.raises(ValidationError):

            complete_report_execution(
                report,
                row_count=10,
            )

    def test_completed_report_cannot_be_started_again(self):

        report = create_report_execution(
            report_type="sales",
            title="Sales Report",
        )

        report = start_report_execution(report)

        report = complete_report_execution(
            report,
            row_count=10,
        )

        with pytest.raises(ValidationError):

            start_report_execution(report)
