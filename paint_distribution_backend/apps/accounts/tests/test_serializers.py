
import pytest

from rest_framework.exceptions import ValidationError

from apps.accounts.models import User

from apps.accounts.serializers import (
    UserCreateSerializer,
    ChangePasswordSerializer,
)


@pytest.mark.django_db
class TestUserCreateSerializer:

    def test_valid_user_creation(self):

        data = {
            "email": "sales@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "role": User.Role.SALES_PERSON,
            "password": "StrongPassword123!",
            "password_confirmation": "StrongPassword123!",
        }

        serializer = UserCreateSerializer(data=data)

        assert serializer.is_valid(), serializer.errors

        user = serializer.save()

        assert user.email == "sales@example.com"
        assert user.check_password("StrongPassword123!")

    def test_duplicate_email(self):

        User.objects.create_user(
            email="sales@example.com",
            password="StrongPassword123!",
            first_name="Existing",
            last_name="User",
        )

        data = {
            "email": "sales@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "password": "StrongPassword123!",
            "password_confirmation": "StrongPassword123!",
        }

        serializer = UserCreateSerializer(data=data)

        assert not serializer.is_valid()

        assert "email" in serializer.errors

    def test_password_mismatch(self):

        data = {
            "email": "sales@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "password": "StrongPassword123!",
            "password_confirmation": "DifferentPassword123!",
        }

        serializer = UserCreateSerializer(data=data)

        assert not serializer.is_valid()

        assert "password_confirmation" in serializer.errors

    def test_password_not_returned(self):

        data = {
            "email": "sales@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "password": "StrongPassword123!",
            "password_confirmation": "StrongPassword123!",
        }

        serializer = UserCreateSerializer(data=data)

        assert serializer.is_valid(), serializer.errors

        user = serializer.save()

        output = UserCreateSerializer(user).data

        assert "password" not in output
        assert "password_confirmation" not in output


@pytest.mark.django_db
class TestChangePasswordSerializer:

    def test_valid_password_change(self):

        user = User.objects.create_user(
            email="employee@example.com",
            password="OldPassword123!",
            first_name="John",
            last_name="Doe",
        )

        class Request:
            pass

        request = Request()
        request.user = user

        data = {
            "current_password": "OldPassword123!",
            "new_password": "NewPassword123!",
            "confirm_new_password": "NewPassword123!",
        }

        serializer = ChangePasswordSerializer(
            data=data,
            context={"request": request},
        )

        assert serializer.is_valid(), serializer.errors

        serializer.save()

        user.refresh_from_db()

        assert user.check_password("NewPassword123!")

    def test_wrong_current_password(self):

        user = User.objects.create_user(
            email="employee@example.com",
            password="OldPassword123!",
            first_name="John",
            last_name="Doe",
        )

        class Request:
            pass

        request = Request()
        request.user = user

        data = {
            "current_password": "WrongPassword123!",
            "new_password": "NewPassword123!",
            "confirm_new_password": "NewPassword123!",
        }

        serializer = ChangePasswordSerializer(
            data=data,
            context={"request": request},
        )

        assert not serializer.is_valid()

        assert "current_password" in serializer.errors
