
import pytest

from datetime import date

from django.db import IntegrityError, transaction

from apps.accounts.models import User

from apps.analytics.models import (
    DashboardSnapshot,
    ReportExecution,
)


@pytest.mark.django_db
class TestDashboardSnapshot:

    def test_create_snapshot(self):

        snapshot = DashboardSnapshot.objects.create(
            title="Monthly Business Performance",
            snapshot_type="monthly",
            period_start=date(2026, 10, 1),
            period_end=date(2026, 10, 31),
            currency="RWF",
            metrics={
                "total_sales": "15000000.00",
                "gross_profit": "4000000.00",
                "total_orders": 150,
            },
        )

        assert snapshot.title == (
            "Monthly Business Performance"
        )

        assert snapshot.currency == "RWF"

        assert snapshot.metrics["total_sales"] == (
            "15000000.00"
        )

    def test_snapshot_uuid(self):

        snapshot = DashboardSnapshot.objects.create(
            title="Daily Report",
            snapshot_type="daily",
            period_start=date(2026, 10, 1),
            period_end=date(2026, 10, 1),
        )

        assert snapshot.id is not None

    def test_snapshot_string_representation(self):

        snapshot = DashboardSnapshot.objects.create(
            title="October Report",
            snapshot_type="monthly",
            period_start=date(2026, 10, 1),
            period_end=date(2026, 10, 31),
        )

        assert "October Report" in str(snapshot)

    def test_invalid_period_is_rejected(self):

        with pytest.raises(IntegrityError):

            with transaction.atomic():

                DashboardSnapshot.objects.create(
                    title="Invalid Report",
                    snapshot_type="monthly",
                    period_start=date(2026, 10, 31),
                    period_end=date(2026, 10, 1),
                )

    def test_duplicate_snapshot_period_is_rejected(self):

        DashboardSnapshot.objects.create(
            title="First Report",
            snapshot_type="monthly",
            period_start=date(2026, 10, 1),
            period_end=date(2026, 10, 31),
        )

        with pytest.raises(IntegrityError):

            with transaction.atomic():

                DashboardSnapshot.objects.create(
                    title="Duplicate Report",
                    snapshot_type="monthly",
                    period_start=date(2026, 10, 1),
                    period_end=date(2026, 10, 31),
                )


@pytest.mark.django_db
class TestReportExecution:

    def test_create_report(self):

        report = ReportExecution.objects.create(
            report_number="RPT-202610-0001",
            report_type="sales",
            title="Monthly Sales Report",
            parameters={
                "period": "October 2026",
            },
        )

        assert report.report_number == (
            "RPT-202610-0001"
        )

        assert report.status == "pending"

        assert report.report_type == "sales"

    def test_report_default_status(self):

        report = ReportExecution.objects.create(
            report_number="RPT-202610-0002",
            report_type="inventory",
            title="Inventory Report",
        )

        assert report.status == (
            ReportExecution.Status.PENDING
        )

    def test_report_can_have_requesting_user(self):

        user = User.objects.create_user(
            email="manager@example.com",
            password="StrongPassword123!",
            first_name="Business",
            last_name="Manager",
            role=User.Role.MANAGER,
        )

        report = ReportExecution.objects.create(
            report_number="RPT-202610-0003",
            report_type="financial",
            title="Financial Report",
            requested_by=user,
        )

        assert report.requested_by == user

    def test_report_string_representation(self):

        report = ReportExecution.objects.create(
            report_number="RPT-202610-0004",
            report_type="sales",
            title="Sales Performance",
        )

        assert "Sales Performance" in str(report)
