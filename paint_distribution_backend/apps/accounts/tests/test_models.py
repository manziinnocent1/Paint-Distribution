
import pytest

from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:

    def test_create_user(self):

        user = User.objects.create_user(
            email="employee@example.com",
            password="StrongPassword123!",
            first_name="John",
            last_name="Doe",
        )

        assert user.email == "employee@example.com"
        assert user.first_name == "John"
        assert user.last_name == "Doe"
        assert user.check_password("StrongPassword123!")
        assert user.is_active is True
        assert user.is_staff is False

    def test_email_is_normalized(self):

        user = User.objects.create_user(
            email="EMPLOYEE@EXAMPLE.COM",
            password="StrongPassword123!",
            first_name="John",
            last_name="Doe",
        )

        assert user.email == "employee@example.com"

    def test_user_requires_email(self):

        with pytest.raises(ValueError):

            User.objects.create_user(
                email=None,
                password="StrongPassword123!",
            )

    def test_create_superuser(self):

        admin_user = User.objects.create_superuser(
            email="admin@example.com",
            password="StrongPassword123!",
            first_name="System",
            last_name="Admin",
        )

        assert admin_user.is_staff is True
        assert admin_user.is_superuser is True
        assert admin_user.is_active is True
        assert admin_user.is_verified is True
        assert admin_user.role == User.Role.ADMIN

    def test_full_name(self):

        user = User.objects.create_user(
            email="employee@example.com",
            password="StrongPassword123!",
            first_name="John",
            last_name="Doe",
        )

        assert user.get_full_name() == "John Doe"

    def test_user_string_representation(self):

        user = User.objects.create_user(
            email="employee@example.com",
            password="StrongPassword123!",
            first_name="John",
            last_name="Doe",
        )

        assert str(user) == (
            "John Doe (employee@example.com)"
        )

    def test_admin_property(self):

        admin_user = User.objects.create_user(
            email="admin@example.com",
            password="StrongPassword123!",
            first_name="System",
            last_name="Admin",
            role=User.Role.ADMIN,
        )

        assert admin_user.is_admin is True

    def test_normal_employee_is_not_admin(self):

        user = User.objects.create_user(
            email="sales@example.com",
            password="StrongPassword123!",
            first_name="Sales",
            last_name="Employee",
        )

        assert user.is_admin is False
