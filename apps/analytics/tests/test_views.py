
import pytest

from datetime import date

from django.urls import reverse

from rest_framework.test import APIClient

from apps.accounts.models import User

from apps.analytics.models import (
    DashboardSnapshot,
    ReportExecution,
)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def admin_user(db):

    return User.objects.create_superuser(
        email="admin@example.com",
        password="StrongPassword123!",
        first_name="System",
        last_name="Admin",
    )


@pytest.fixture
def manager(db):

    return User.objects.create_user(
        email="manager@example.com",
        password="StrongPassword123!",
        first_name="Business",
        last_name="Manager",
        role=User.Role.MANAGER,
    )


@pytest.fixture
def accountant(db):

    return User.objects.create_user(
        email="accountant@example.com",
        password="StrongPassword123!",
        first_name="Finance",
        last_name="Officer",
        role=User.Role.ACCOUNTANT,
    )


@pytest.fixture
def salesperson(db):

    return User.objects.create_user(
        email="sales@example.com",
        password="StrongPassword123!",
        first_name="Sales",
        last_name="Employee",
        role=User.Role.SALES_PERSON,
    )


@pytest.fixture
def snapshot(db, manager):

    return DashboardSnapshot.objects.create(
        title="October Business Performance",
        snapshot_type="monthly",
        period_start=date(2026, 10, 1),
        period_end=date(2026, 10, 31),
        currency="RWF",
        metrics={
            "total_sales": "15000000.00",
            "gross_profit": "4000000.00",
            "total_orders": 150,
        },
        generated_by=manager,
    )


@pytest.mark.django_db
class TestDashboardSnapshotAPI:

    def test_unauthenticated_access_is_denied(
        self,
        api_client,
    ):

        response = api_client.get(
            reverse("analytics-snapshots-list")
        )

        assert response.status_code == 401

    def test_manager_can_list_snapshots(
        self,
        api_client,
        manager,
        snapshot,
    ):

        api_client.force_authenticate(
            user=manager
        )

        response = api_client.get(
            reverse("analytics-snapshots-list")
        )

        assert response.status_code == 200

        assert response.data["count"] == 1

    def test_accountant_can_list_snapshots(
        self,
        api_client,
        accountant,
        snapshot,
    ):

        api_client.force_authenticate(
            user=accountant
        )

        response = api_client.get(
            reverse("analytics-snapshots-list")
        )

        assert response.status_code == 200

    def test_salesperson_cannot_access_snapshots(
        self,
        api_client,
        salesperson,
    ):

        api_client.force_authenticate(
            user=salesperson
        )

        response = api_client.get(
            reverse("analytics-snapshots-list")
        )

        assert response.status_code == 403

    def test_admin_can_retrieve_snapshot(
        self,
        api_client,
        admin_user,
        snapshot,
    ):

        api_client.force_authenticate(
            user=admin_user
        )

        response = api_client.get(
            reverse(
                "analytics-snapshots-detail",
                kwargs={"pk": str(snapshot.id)},
            )
        )

        assert response.status_code == 200

        assert response.data["title"] == (
            "October Business Performance"
        )

    def test_latest_snapshot_endpoint(
        self,
        api_client,
        manager,
        snapshot,
    ):

        api_client.force_authenticate(
            user=manager
        )

        response = api_client.get(
            reverse("analytics-snapshots-latest")
        )

        assert response.status_code == 200

        assert response.data["id"] == str(snapshot.id)

    def test_filter_by_snapshot_type(
        self,
        api_client,
        manager,
        snapshot,
    ):

        api_client.force_authenticate(
            user=manager
        )

        response = api_client.get(
            reverse("analytics-snapshots-list"),
            {"snapshot_type": "monthly"},
        )

        assert response.status_code == 200

        assert response.data["count"] == 1

    def test_snapshot_api_does_not_allow_creation(
        self,
        api_client,
        admin_user,
    ):

        api_client.force_authenticate(
            user=admin_user
        )

        response = api_client.post(
            reverse("analytics-snapshots-list"),
            {
                "title": "Fake Report",
            },
            format="json",
        )

        assert response.status_code == 405


@pytest.mark.django_db
class TestReportExecutionAPI:

    def test_manager_can_list_reports(
        self,
        api_client,
        manager,
    ):

        ReportExecution.objects.create(
            report_number="RPT-202610-0001",
            report_type="sales",
            title="Monthly Sales Report",
            requested_by=manager,
        )

        api_client.force_authenticate(
            user=manager
        )

        response = api_client.get(
            reverse("analytics-reports-list")
        )

        assert response.status_code == 200

        assert response.data["count"] == 1

    def test_salesperson_cannot_access_reports(
        self,
        api_client,
        salesperson,
    ):

        api_client.force_authenticate(
            user=salesperson
        )

        response = api_client.get(
            reverse("analytics-reports-list")
        )

        assert response.status_code == 403

    def test_report_detail(
        self,
        api_client,
        manager,
    ):

        report = ReportExecution.objects.create(
            report_number="RPT-202610-0002",
            report_type="inventory",
            title="Inventory Report",
            requested_by=manager,
        )

        api_client.force_authenticate(
            user=manager
        )

        response = api_client.get(
            reverse(
                "analytics-reports-detail",
                kwargs={"pk": str(report.id)},
            )
        )

        assert response.status_code == 200

        assert response.data["report_number"] == (
            "RPT-202610-0002"
        )

    def test_report_api_is_read_only(
        self,
        api_client,
        admin_user,
    ):

        api_client.force_authenticate(
            user=admin_user
        )

        response = api_client.post(
            reverse("analytics-reports-list"),
            {
                "title": "Unauthorized Report",
            },
            format="json",
        )

        assert response.status_code == 405
