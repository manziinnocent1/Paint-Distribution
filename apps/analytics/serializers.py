
from rest_framework import serializers

from .models import (
    DashboardSnapshot,
    ReportExecution,
)


class DashboardSnapshotSerializer(
    serializers.ModelSerializer
):

    snapshot_type_display = serializers.CharField(
        source="get_snapshot_type_display",
        read_only=True,
    )

    generated_by_email = serializers.EmailField(
        source="generated_by.email",
        read_only=True,
        allow_null=True,
    )

    class Meta:

        model = DashboardSnapshot

        fields = [
            "id",
            "title",
            "snapshot_type",
            "snapshot_type_display",
            "period_start",
            "period_end",
            "currency",
            "metrics",
            "source_metadata",
            "notes",
            "generated_at",
            "generated_by",
            "generated_by_email",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class ReportExecutionSerializer(
    serializers.ModelSerializer
):

    report_type_display = serializers.CharField(
        source="get_report_type_display",
        read_only=True,
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    requested_by_email = serializers.EmailField(
        source="requested_by.email",
        read_only=True,
        allow_null=True,
    )

    class Meta:

        model = ReportExecution

        fields = [
            "id",
            "report_number",
            "report_type",
            "report_type_display",
            "title",
            "description",
            "parameters",
            "status",
            "status_display",
            "output_file",
            "error_message",
            "row_count",
            "requested_by",
            "requested_by_email",
            "started_at",
            "completed_at",
            "expires_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields
