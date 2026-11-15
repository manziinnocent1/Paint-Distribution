
import uuid

from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
)

from django.utils import timezone

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    class Role(models.TextChoices):

        ADMIN = "admin", "Administrator"

        MANAGER = "manager", "Business Manager"

        SALES_MANAGER = "sales_manager", "Sales Manager"

        SALES_PERSON = "sales_person", "Salesperson"

        INVENTORY_MANAGER = (
            "inventory_manager",
            "Inventory Manager",
        )

        STOREKEEPER = "storekeeper", "Storekeeper"

        PROCUREMENT_OFFICER = (
            "procurement_officer",
            "Procurement Officer",
        )

        ACCOUNTANT = "accountant", "Accountant"

        PRODUCTION_MANAGER = (
            "production_manager",
            "Production Manager",
        )

        PRODUCTION_OPERATOR = (
            "production_operator",
            "Production Operator",
        )

        DELIVERY_MANAGER = (
            "delivery_manager",
            "Delivery Manager",
        )

    class Gender(models.TextChoices):

        MALE = "male", "Male"

        FEMALE = "female", "Female"

        OTHER = "other", "Other"

        NOT_SPECIFIED = (
            "not_specified",
            "Prefer not to say",
        )

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    email = models.EmailField(
        unique=True,
        max_length=254,
        db_index=True,
    )

    first_name = models.CharField(
        max_length=100,
    )

    last_name = models.CharField(
        max_length=100,
    )

    phone_number = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
    )

    profile_image = models.ImageField(
        upload_to="accounts/profile_images/",
        null=True,
        blank=True,
    )

    date_of_birth = models.DateField(
        null=True,
        blank=True,
    )

    gender = models.CharField(
        max_length=20,
        choices=Gender.choices,
        default=Gender.NOT_SPECIFIED,
    )

    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.SALES_PERSON,
        db_index=True,
    )

    employee_number = models.CharField(
        max_length=30,
        unique=True,
        null=True,
        blank=True,
    )

    job_title = models.CharField(
        max_length=150,
        blank=True,
    )

    department = models.CharField(
        max_length=100,
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )

    city = models.CharField(
        max_length=100,
        default="Kigali",
    )

    country = models.CharField(
        max_length=100,
        default="Rwanda",
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    is_staff = models.BooleanField(
        default=False,
    )

    is_verified = models.BooleanField(
        default=False,
    )

    date_joined = models.DateTimeField(
        default=timezone.now,
    )

    last_login = models.DateTimeField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
    ]

    class Meta:

        db_table = "accounts_user"

        verbose_name = "User"

        verbose_name_plural = "Users"

        ordering = ["-date_joined"]

        indexes = [
            models.Index(
                fields=["role", "is_active"],
                name="user_role_active_idx",
            ),
            models.Index(
                fields=["date_joined"],
                name="user_joined_idx",
            ),
        ]

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name

    @property
    def is_admin(self):
        return (
            self.is_superuser
            or self.role == self.Role.ADMIN
        )
