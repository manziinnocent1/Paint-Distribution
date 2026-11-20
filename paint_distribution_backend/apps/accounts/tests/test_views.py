
import pytest

from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient

User = get_user_model()


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
def employee(db):
    return User.objects.create_user(
        email="employee@example.com",
        password="StrongPassword123!",
        first_name="John",
        last_name="Doe",
    )


@pytest.mark.django_db
class TestAccountsAPI:

    def test_unauthenticated_user_cannot_access_users(
        self,
        api_client,
    ):

        url = reverse("users-list")

        response = api_client.get(url)

        assert response.status_code == 401

    def test_admin_can_list_users(
        self,
        api_client,
        admin_user,
        employee,
    ):

        api_client.force_authenticate(
            user=admin_user
        )

        response = api_client.get(
            reverse("users-list")
        )

        assert response.status_code == 200

        assert response.data["count"] == 2

    def test_employee_cannot_list_all_users(
        self,
        api_client,
        employee,
        admin_user,
    ):

        api_client.force_authenticate(
            user=employee
        )

        response = api_client.get(
            reverse("users-list")
        )

        assert response.status_code == 403

    def test_employee_can_view_own_profile(
        self,
        api_client,
        employee,
    ):

        api_client.force_authenticate(
            user=employee
        )

        response = api_client.get(
            reverse("users-me")
        )

        assert response.status_code == 200

        assert response.data["email"] == employee.email

    def test_employee_cannot_view_another_profile(
        self,
        api_client,
        employee,
        admin_user,
    ):

        api_client.force_authenticate(
            user=employee
        )

        response = api_client.get(
            reverse(
                "users-detail",
                kwargs={"pk": str(admin_user.id)},
            )
        )

        assert response.status_code == 404

    def test_employee_can_update_own_profile(
        self,
        api_client,
        employee,
    ):

        api_client.force_authenticate(
            user=employee
        )

        response = api_client.patch(
            reverse("users-update-me"),
            {
                "first_name": "Updated",
            },
            format="json",
        )

        assert response.status_code == 200

        employee.refresh_from_db()

        assert employee.first_name == "Updated"

    def test_employee_cannot_update_own_role(
        self,
        api_client,
        employee,
    ):

        api_client.force_authenticate(
            user=employee
        )

        response = api_client.patch(
            reverse("users-update-me"),
            {
                "role": User.Role.ADMIN,
            },
            format="json",
        )

        assert response.status_code == 200

        employee.refresh_from_db()

        assert employee.role == User.Role.SALES_PERSON

    def test_only_admin_can_create_employee(
        self,
        api_client,
        admin_user,
    ):

        api_client.force_authenticate(
            user=admin_user
        )

        response = api_client.post(
            reverse("users-list"),
            {
                "email": "newemployee@example.com",
                "first_name": "New",
                "last_name": "Employee",
                "role": User.Role.STOREKEEPER,
                "password": "StrongPassword123!",
                "password_confirmation": "StrongPassword123!",
            },
            format="json",
        )

        assert response.status_code == 201

        assert User.objects.filter(
            email="newemployee@example.com"
        ).exists()

    def test_admin_can_deactivate_employee(
        self,
        api_client,
        admin_user,
        employee,
    ):

        api_client.force_authenticate(
            user=admin_user
        )

        response = api_client.patch(
            reverse(
                "users-deactivate",
                kwargs={"pk": str(employee.id)},
            ),
            {},
            format="json",
        )

        assert response.status_code == 200

        employee.refresh_from_db()

        assert employee.is_active is False

    def test_employee_cannot_change_password_without_correct_current_password(
        self,
        api_client,
        employee,
    ):

        api_client.force_authenticate(
            user=employee
        )

        response = api_client.post(
            reverse("users-change-password"),
            {
                "current_password": "WrongPassword123!",
                "new_password": "NewPassword123!",
                "confirm_new_password": "NewPassword123!",
            },
            format="json",
        )

        assert response.status_code == 400
