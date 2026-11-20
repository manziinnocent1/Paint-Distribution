
import pytest

from datetime import date

from apps.analytics.models import (
    DashboardSnapshot,
    ReportExecution,
)

from apps.analytics.serializers import (
    DashboardSnapshotSerializer,
    ReportExecutionSerializer,
)


@pytest.mark.django_db
class TestDashboardSnapshotSerializer:

    def test_snapshot_serialization(self):

        snapshot = DashboardSnapshot.objects.create(
            title="Monthly Report",
            snapshot_type="monthly",
            period_start=date(2026, 10, 1),
            period_end=date(2026, 10, 31),
            currency="RWF",
            metrics={
                "total_sales": "1000000.00",
            },
        )

        serializer = DashboardSnapshotSerializer(
            snapshot
        )

        assert serializer.data["title"] == (
            "Monthly Report"
        )

        assert serializer.data["currency"] == "RWF"

        assert serializer.data["metrics"][
            "total_sales"
        ] == "1000000.00"

        assert serializer.data[
            "snapshot_type_display"
        ] == "Monthly"

    def test_snapshot_serializer_is_read_only(self):

        snapshot = DashboardSnapshot.objects.create(
            title="Monthly Report",
            snapshot_type="monthly",
            period_start=date(2026, 10, 1),
            period_end=date(2026, 10, 31),
        )

        serializer = DashboardSnapshotSerializer(
            snapshot,
            data={"title": "Changed Report"},
        )

        assert serializer.is_valid()

        assert serializer.validated_data == {}


@pytest.mark.django_db
class TestReportExecutionSerializer:

    def test_report_serialization(self):

        report = ReportExecution.objects.create(
            report_number="RPT-202610-0001",
            report_type="sales",
            title="Monthly Sales",
        )

        serializer = ReportExecutionSerializer(
            report
        )

        assert serializer.data["report_number"] == (
            "RPT-202610-0001"
        )

        assert serializer.data["status"] == "pending"

        assert serializer.data[
            "report_type_display"
        ] == "Sales Report"
