
import pytest

from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework.views import APIView

from apps.accounts.models import User

from apps.analytics.permissions import (
    IsAnalyticsViewer,
    IsAnalyticsManager,
)


@pytest.mark.django_db
class TestAnalyticsPermissions:

    def setup_method(self):
        self.factory = APIRequestFactory()
        self.view = APIView()

    def get_authenticated_request(self, user):

        django_request = self.factory.get(
            "/api/v1/analytics/snapshots/"
        )

        force_authenticate(
            django_request,
            user=user,
        )

        request = self.view.initialize_request(
            django_request
        )

        return request

    def test_admin_can_view_analytics(self):

        user = User.objects.create_superuser(
            email="admin@example.com",
            password="StrongPassword123!",
            first_name="System",
            last_name="Admin",
        )

        request = self.get_authenticated_request(user)

        assert IsAnalyticsViewer().has_permission(
            request,
            self.view,
        )

    def test_manager_can_view_analytics(self):

        user = User.objects.create_user(
            email="manager@example.com",
            password="StrongPassword123!",
            first_name="Business",
            last_name="Manager",
            role=User.Role.MANAGER,
        )

        request = self.get_authenticated_request(user)

        assert IsAnalyticsViewer().has_permission(
            request,
            self.view,
        )

    def test_accountant_can_view_analytics(self):

        user = User.objects.create_user(
            email="accountant@example.com",
            password="StrongPassword123!",
            first_name="Finance",
            last_name="Officer",
            role=User.Role.ACCOUNTANT,
        )

        request = self.get_authenticated_request(user)

        assert IsAnalyticsViewer().has_permission(
            request,
            self.view,
        )

    def test_salesperson_cannot_view_financial_analytics(self):

        user = User.objects.create_user(
            email="sales@example.com",
            password="StrongPassword123!",
            first_name="Sales",
            last_name="Employee",
            role=User.Role.SALES_PERSON,
        )

        request = self.get_authenticated_request(user)

        assert not IsAnalyticsViewer().has_permission(
            request,
            self.view,
        )

    def test_accountant_cannot_manage_analytics(self):

        user = User.objects.create_user(
            email="accountant@example.com",
            password="StrongPassword123!",
            first_name="Finance",
            last_name="Officer",
            role=User.Role.ACCOUNTANT,
        )

        request = self.get_authenticated_request(user)

        assert not IsAnalyticsManager().has_permission(
            request,
            self.view,
        )
