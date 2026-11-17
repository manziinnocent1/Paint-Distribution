import uuid

from django.conf import settings
from django.db import models


class Supplier(models.Model):

    class SupplierType(models.TextChoices):
        COMPANY = "COMPANY", "Company"
        INDIVIDUAL = "INDIVIDUAL", "Individual"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"
        BLOCKED = "BLOCKED", "Blocked"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    supplier_number = models.CharField(
        max_length=40,
        unique=True,
        db_index=True,
    )

    supplier_type = models.CharField(
        max_length=20,
        choices=SupplierType.choices,
        default=SupplierType.COMPANY,
    )

    name = models.CharField(max_length=200, db_index=True)
    contact_person = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=30)
    alternative_phone = models.CharField(max_length=30, blank=True)

    tax_identification_number = models.CharField(
        max_length=100,
        blank=True,
    )

    country = models.CharField(max_length=100, default="Rwanda")
    province = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    street_address = models.CharField(max_length=255, blank=True)
    website = models.URLField(blank=True)

    payment_terms_days = models.PositiveIntegerField(default=0)

    bank_name = models.CharField(max_length=150, blank=True)
    bank_account_name = models.CharField(max_length=150, blank=True)
    bank_account_number = models.CharField(max_length=100, blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    notes = models.TextField(blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_suppliers",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "suppliers_suppliers"
        ordering = ["name"]
        indexes = [
            models.Index(
                fields=["status", "supplier_type"],
                name="supplier_status_type_idx",
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.supplier_number})"


class SupplierContact(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE,
        related_name="contacts",
    )

    full_name = models.CharField(max_length=150)
    job_title = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=30)
    is_primary = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "suppliers_contacts"
        ordering = ["-is_primary", "full_name"]

    def __str__(self):
        return f"{self.full_name} - {self.supplier.name}"


class SupplierProduct(models.Model):
    """
    Records which catalog variants a supplier can supply.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE,
        related_name="products",
    )

    product_variant = models.ForeignKey(
        "catalog.ProductVariant",
        on_delete=models.PROTECT,
        related_name="supplier_products",
    )

    supplier_product_code = models.CharField(
        max_length=100,
        blank=True,
    )

    last_purchase_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
    )

    currency = models.CharField(max_length=3, default="RWF")

    minimum_order_quantity = models.DecimalField(
        max_digits=14,
        decimal_places=3,
        default=1,
    )

    lead_time_days = models.PositiveIntegerField(default=0)
    is_preferred = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "suppliers_products"
        constraints = [
            models.UniqueConstraint(
                fields=["supplier", "product_variant"],
                name="supplier_unique_product_variant",
            ),
        ]

    def __str__(self):
        return f"{self.supplier.name} - {self.product_variant.sku}"