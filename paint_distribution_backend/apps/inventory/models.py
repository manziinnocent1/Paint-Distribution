import uuid
from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import F, Q


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


class Warehouse(UUIDTimestampModel):

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"

    name = models.CharField(max_length=150)

    code = models.CharField(
        max_length=40,
        unique=True,
    )

    description = models.TextField(blank=True)

    country = models.CharField(
        max_length=100,
        default="Rwanda",
    )

    province = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    sector = models.CharField(max_length=100, blank=True)
    street_address = models.CharField(max_length=255, blank=True)

    contact_person = models.CharField(max_length=150, blank=True)
    contact_phone = models.CharField(max_length=30, blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True,
    )

    is_default = models.BooleanField(default=False)

    class Meta:
        db_table = "inventory_warehouses"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.code})"


class StockLevel(UUIDTimestampModel):

    warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.PROTECT,
        related_name="stock_levels",
    )

    product_variant = models.ForeignKey(
        "catalog.ProductVariant",
        on_delete=models.PROTECT,
        related_name="stock_levels",
    )

    quantity_on_hand = models.DecimalField(
        max_digits=14,
        decimal_places=3,
        default=0,
        validators=[MinValueValidator(0)],
    )

    quantity_reserved = models.DecimalField(
        max_digits=14,
        decimal_places=3,
        default=0,
        validators=[MinValueValidator(0)],
    )

    reorder_level = models.DecimalField(
        max_digits=14,
        decimal_places=3,
        default=0,
        validators=[MinValueValidator(0)],
    )

    maximum_stock_level = models.DecimalField(
        max_digits=14,
        decimal_places=3,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )

    class Meta:
        db_table = "inventory_stock_levels"
        ordering = ["warehouse", "product_variant"]

        constraints = [
            models.UniqueConstraint(
                fields=["warehouse", "product_variant"],
                name="inventory_unique_warehouse_variant",
            ),
            models.CheckConstraint(
                condition=Q(quantity_reserved__lte=F("quantity_on_hand")),
                name="inventory_reserved_lte_on_hand",
            ),
        ]

        indexes = [
            models.Index(
                fields=["warehouse", "product_variant"],
                name="inv_warehouse_variant_idx",
            ),
        ]

    def __str__(self):
        return (
            f"{self.product_variant} - {self.warehouse}: "
            f"{self.quantity_on_hand}"
        )

    @property
    def available_quantity(self):
        return self.quantity_on_hand - self.quantity_reserved

    @property
    def is_low_stock(self):
        return self.available_quantity <= self.reorder_level


class StockMovement(UUIDTimestampModel):

    class MovementType(models.TextChoices):
        RECEIPT = "RECEIPT", "Stock receipt"
        ISSUE = "ISSUE", "Stock issue"
        TRANSFER = "TRANSFER", "Warehouse transfer"
        ADJUSTMENT_IN = "ADJUSTMENT_IN", "Positive adjustment"
        ADJUSTMENT_OUT = "ADJUSTMENT_OUT", "Negative adjustment"
        RETURN = "RETURN", "Customer return"

    movement_number = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
    )

    product_variant = models.ForeignKey(
        "catalog.ProductVariant",
        on_delete=models.PROTECT,
        related_name="stock_movements",
    )

    movement_type = models.CharField(
        max_length=30,
        choices=MovementType.choices,
        db_index=True,
    )

    from_warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.PROTECT,
        related_name="outgoing_movements",
        null=True,
        blank=True,
    )

    to_warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.PROTECT,
        related_name="incoming_movements",
        null=True,
        blank=True,
    )

    quantity = models.DecimalField(
        max_digits=14,
        decimal_places=3,
        validators=[MinValueValidator(Decimal("0.001"))],
    )

    unit_cost = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )

    reference = models.CharField(
        max_length=100,
        blank=True,
        help_text="Example: purchase reference, sales order, or adjustment reference.",
    )

    reason = models.TextField(blank=True)

    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="performed_stock_movements",
    )

    class Meta:
        db_table = "inventory_stock_movements"
        ordering = ["-created_at"]

        indexes = [
            models.Index(
                fields=["movement_type", "created_at"],
                name="inventory_movement_type_idx",
            ),
            models.Index(
                fields=["product_variant", "created_at"],
                name="inventory_variant_date_idx",
            ),
        ]

    def __str__(self):
        return f"{self.movement_number} - {self.movement_type}"