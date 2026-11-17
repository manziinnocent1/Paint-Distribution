import uuid

from django.conf import settings
from django.db import models


class UUIDTimestampModel(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Customer(UUIDTimestampModel):
    class CustomerType(models.TextChoices):
        INDIVIDUAL = "INDIVIDUAL", "Individual"
        BUSINESS = "BUSINESS", "Business"

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"
        BLOCKED = "BLOCKED", "Blocked"

    customer_number = models.CharField(
        max_length=40,
        unique=True,
        db_index=True,
    )

    customer_type = models.CharField(
        max_length=20,
        choices=CustomerType.choices,
        default=CustomerType.INDIVIDUAL,
        db_index=True,
    )

    first_name = models.CharField(
        max_length=100,
        blank=True,
    )

    last_name = models.CharField(
        max_length=100,
        blank=True,
    )

    business_name = models.CharField(
        max_length=200,
        blank=True,
    )

    tax_identification_number = models.CharField(
        max_length=100,
        blank=True,
    )

    email = models.EmailField(
        blank=True,
        db_index=True,
    )

    phone_number = models.CharField(
        max_length=30,
        db_index=True,
    )

    alternative_phone = models.CharField(
        max_length=30,
        blank=True,
    )

    website = models.URLField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True,
    )

    notes = models.TextField(blank=True)

    credit_limit = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
    )

    payment_terms_days = models.PositiveIntegerField(
        default=0,
        help_text="Number of days allowed for payment after an invoice.",
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_customers",
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_customers",
    )

    class Meta:
        db_table = "customers_customers"
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["customer_type", "status"],
                name="customers_type_status_idx",
            ),
        ]

    def __str__(self):
        if self.customer_type == self.CustomerType.BUSINESS:
            return self.business_name or self.customer_number

        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name or self.customer_number


class CustomerAddress(UUIDTimestampModel):
    class AddressType(models.TextChoices):
        BILLING = "BILLING", "Billing"
        DELIVERY = "DELIVERY", "Delivery"
        BUSINESS = "BUSINESS", "Business"
        HOME = "HOME", "Home"
        OTHER = "OTHER", "Other"

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="addresses",
    )

    address_type = models.CharField(
        max_length=20,
        choices=AddressType.choices,
        default=AddressType.DELIVERY,
    )

    label = models.CharField(
        max_length=100,
        blank=True,
        help_text="Example: Main office, Construction site, Home.",
    )

    contact_person = models.CharField(
        max_length=150,
        blank=True,
    )

    contact_phone = models.CharField(
        max_length=30,
        blank=True,
    )

    country = models.CharField(
        max_length=100,
        default="Rwanda",
    )

    province = models.CharField(
        max_length=100,
        blank=True,
    )

    district = models.CharField(
        max_length=100,
        blank=True,
    )

    sector = models.CharField(
        max_length=100,
        blank=True,
    )

    cell = models.CharField(
        max_length=100,
        blank=True,
    )

    village = models.CharField(
        max_length=100,
        blank=True,
    )

    street_address = models.CharField(
        max_length=255,
        blank=True,
    )

    landmark = models.CharField(
        max_length=255,
        blank=True,
    )

    postal_code = models.CharField(
        max_length=30,
        blank=True,
    )

    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )

    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )

    is_default = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "customers_addresses"
        ordering = ["-is_default", "created_at"]
        indexes = [
            models.Index(
                fields=["customer", "address_type"],
                name="customers_address_type_idx",
            ),
        ]

    def __str__(self):
        return (
            f"{self.customer} - "
            f"{self.label or self.address_type}"
        )


class CustomerContact(UUIDTimestampModel):
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="contacts",
    )

    full_name = models.CharField(max_length=150)

    job_title = models.CharField(
        max_length=100,
        blank=True,
    )

    email = models.EmailField(blank=True)

    phone_number = models.CharField(max_length=30)

    is_primary = models.BooleanField(default=False)

    notes = models.TextField(blank=True)

    class Meta:
        db_table = "customers_contacts"
        ordering = ["-is_primary", "full_name"]

    def __str__(self):
        return f"{self.full_name} - {self.customer}"