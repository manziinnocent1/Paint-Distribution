
from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import serializers

from .models import User


class UserReadSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(
        source="get_full_name",
        read_only=True,
    )

    role_display = serializers.CharField(
        source="get_role_display",
        read_only=True,
    )

    class Meta:
        model = User

        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone_number",
            "profile_image",
            "date_of_birth",
            "gender",
            "role",
            "role_display",
            "employee_number",
            "job_title",
            "department",
            "address",
            "city",
            "country",
            "is_active",
            "is_verified",
            "date_joined",
            "last_login",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
    )

    password_confirmation = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User

        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "role",
            "employee_number",
            "job_title",
            "department",
            "password",
            "password_confirmation",
        ]

        read_only_fields = ["id"]

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate_phone_number(self, value):
        if value and User.objects.filter(
            phone_number=value
        ).exists():
            raise serializers.ValidationError(
                "This phone number is already registered."
            )

        return value

    def validate(self, attrs):
        password = attrs.get("password")

        confirmation = attrs.get(
            "password_confirmation"
        )

        if password != confirmation:
            raise serializers.ValidationError({
                "password_confirmation": (
                    "Passwords do not match."
                )
            })

        temporary_user = User(
            email=attrs.get("email"),
            first_name=attrs.get("first_name"),
            last_name=attrs.get("last_name"),
        )

        try:
            password_validation.validate_password(
                password,
                user=temporary_user,
            )
        except DjangoValidationError as error:
            raise serializers.ValidationError({
                "password": list(error.messages)
            })

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirmation")

        password = validated_data.pop("password")

        return User.objects.create_user(
            password=password,
            **validated_data,
        )


class UserUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "first_name",
            "last_name",
            "phone_number",
            "profile_image",
            "date_of_birth",
            "gender",
            "job_title",
            "department",
            "address",
            "city",
            "country",
        ]

    def validate_phone_number(self, value):
        user = self.instance

        if User.objects.exclude(
            pk=user.pk
        ).filter(phone_number=value).exists():
            raise serializers.ValidationError(
                "This phone number is already in use."
            )

        return value


class AdminUserUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "first_name",
            "last_name",
            "phone_number",
            "profile_image",
            "date_of_birth",
            "gender",
            "role",
            "employee_number",
            "job_title",
            "department",
            "address",
            "city",
            "country",
            "is_active",
            "is_verified",
        ]


class ChangePasswordSerializer(serializers.Serializer):

    current_password = serializers.CharField(
        write_only=True,
        required=True,
    )

    new_password = serializers.CharField(
        write_only=True,
        required=True,
    )

    confirm_new_password = serializers.CharField(
        write_only=True,
        required=True,
    )

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.check_password(
            attrs["current_password"]
        ):
            raise serializers.ValidationError({
                "current_password": (
                    "Your current password is incorrect."
                )
            })

        if attrs["new_password"] != attrs[
            "confirm_new_password"
        ]:
            raise serializers.ValidationError({
                "confirm_new_password": (
                    "New passwords do not match."
                )
            })

        try:
            password_validation.validate_password(
                attrs["new_password"],
                user=user,
            )
        except DjangoValidationError as error:
            raise serializers.ValidationError({
                "new_password": list(error.messages)
            })

        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user

        user.set_password(
            self.validated_data["new_password"]
        )

        user.save(update_fields=["password"])

        return user
