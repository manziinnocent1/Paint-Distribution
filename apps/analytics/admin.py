
from django.contrib import admin

from .models import (
    DashboardSnapshot,
    ReportExecution,
)


@admin.register(DashboardSnapshot)
class DashboardSnapshotAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "snapshot_type",
        "period_start",
        "period_end",
        "currency",
        "generated_by",
        "generated_at",
    )

    list_filter = (
        "snapshot_type",
        "currency",
        "generated_at",
    )

    search_fields = (
        "title",
        "notes",
        "generated_by__email",
    )

    ordering = (
        "-period_end",
        "-generated_at",
    )

    readonly_fields = (
        "id",
        "title",
        "snapshot_type",
        "period_start",
        "period_end",
        "currency",
        "metrics",
        "source_metadata",
        "notes",
        "generated_at",
        "generated_by",
        "created_at",
        "updated_at",
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ReportExecution)
class ReportExecutionAdmin(admin.ModelAdmin):

    list_display = (
        "report_number",
        "title",
        "report_type",
        "status",
        "requested_by",
        "created_at",
        "completed_at",
    )

    list_filter = (
        "report_type",
        "status",
        "created_at",
    )

    search_fields = (
        "report_number",
        "title",
        "description",
        "requested_by__email",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "id",
        "report_number",
        "report_type",
        "title",
        "description",
        "parameters",
        "status",
        "output_file",
        "error_message",
        "row_count",
        "requested_by",
        "started_at",
        "completed_at",
        "expires_at",
        "created_at",
        "updated_at",
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
