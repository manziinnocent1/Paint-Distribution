
from django.conf import settings
from django.db import models
from django.db.models import Q, F

from django.utils import timezone

from common.models import UUIDTimeStampedModel


class DashboardSnapshot(UUIDTimeStampedModel):

    class SnapshotType(models.TextChoices):

        DAILY = "daily", "Daily"

        WEEKLY = "weekly", "Weekly"

        MONTHLY = "monthly", "Monthly"

        QUARTERLY = "quarterly", "Quarterly"

        YEARLY = "yearly", "Yearly"

        CUSTOM = "custom", "Custom Period"

    title = models.CharField(
        max_length=255,
    )

    snapshot_type = models.CharField(
        max_length=20,
        choices=SnapshotType.choices,
        db_index=True,
    )

    period_start = models.DateField(
        db_index=True,
    )

    period_end = models.DateField(
        db_index=True,
    )

    currency = models.CharField(
        max_length=3,
        default="RWF",
    )

    metrics = models.JSONField(
        default=dict,
        help_text=(
            "Stores calculated dashboard metrics. "
            "Financial values should be serialized as strings."
        ),
    )

    source_metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text=(
            "Records source applications, calculation versions "
            "and other snapshot metadata."
        ),
    )

    notes = models.TextField(
        blank=True,
    )

    generated_at = models.DateTimeField(
        default=timezone.now,
        db_index=True,
    )

    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="generated_dashboard_snapshots",
    )

    class Meta:

        db_table = "analytics_dashboard_snapshots"

        verbose_name = "Dashboard Snapshot"

        verbose_name_plural = "Dashboard Snapshots"

        ordering = ["-period_end", "-generated_at"]

        constraints = [
            models.CheckConstraint(
                condition=Q(
                    period_end__gte=F("period_start")
                ),
                name="analytics_valid_snapshot_period",
            ),

            models.UniqueConstraint(
                fields=[
                    "snapshot_type",
                    "period_start",
                    "period_end",
                ],
                name="unique_analytics_snapshot_period",
            ),
        ]

        indexes = [
            models.Index(
                fields=[
                    "snapshot_type",
                    "period_end",
                ],
                name="analytics_snapshot_type_idx",
            ),
        ]

    def __str__(self):

        return (
            f"{self.title} "
            f"({self.period_start} - {self.period_end})"
        )


class ReportExecution(UUIDTimeStampedModel):

    class ReportType(models.TextChoices):

        SALES = "sales", "Sales Report"

        FINANCIAL = "financial", "Financial Report"

        INVENTORY = "inventory", "Inventory Report"

        MANUFACTURING = (
            "manufacturing",
            "Manufacturing Report",
        )

        COLOR_MIXING = (
            "color_mixing",
            "Colour Mixing Report",
        )

        PROCUREMENT = (
            "procurement",
            "Procurement Report",
        )

        CUSTOMERS = (
            "customers",
            "Customer Report",
        )

        DELIVERIES = (
            "deliveries",
            "Delivery Report",
        )

        EXPENSES = (
            "expenses",
            "Expense Report",
        )

        CUSTOM = "custom", "Custom Report"

    class Status(models.TextChoices):

        PENDING = "pending", "Pending"

        RUNNING = "running", "Running"

        COMPLETED = "completed", "Completed"

        FAILED = "failed", "Failed"

        CANCELLED = "cancelled", "Cancelled"

    report_number = models.CharField(
        max_length=40,
        unique=True,
        db_index=True,
    )

    report_type = models.CharField(
        max_length=30,
        choices=ReportType.choices,
        db_index=True,
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    parameters = models.JSONField(
        default=dict,
        blank=True,
        help_text=(
            "Report filters such as date range, category, "
            "supplier, product or customer."
        ),
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    output_file = models.FileField(
        upload_to="analytics/reports/%Y/%m/",
        null=True,
        blank=True,
    )

    error_message = models.TextField(
        blank=True,
    )

    row_count = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="requested_analytics_reports",
    )

    started_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:

        db_table = "analytics_report_executions"

        verbose_name = "Report Execution"

        verbose_name_plural = "Report Executions"

        ordering = ["-created_at"]

        indexes = [
            models.Index(
                fields=[
                    "report_type",
                    "status",
                ],
                name="analytics_report_type_idx",
            ),

            models.Index(
                fields=[
                    "requested_by",
                    "created_at",
                ],
                name="analytics_report_user_idx",
            ),
        ]

    def __str__(self):

        return (
            f"{self.report_number} - {self.title}"
        )
