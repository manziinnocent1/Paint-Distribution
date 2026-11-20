
import uuid

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone

from decimal import Decimal


class Price(models.Model):

    class PriceType(models.TextChoices):
        RETAIL = "RETAIL", "Retail"
        WHOLESALE = "WHOLESALE", "Wholesale"
        CUSTOMER = "CUSTOMER", "Customer-specific"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    product_variant_id = models.UUIDField(
        db_index=True,
        help_text="UUID of the catalog ProductVariant.",
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="custom_prices",
    )

    price_type = models.CharField(
        max_length=20,
        choices=PriceType.choices,
        default=PriceType.RETAIL,
        db_index=True,
    )

    amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],

    )

    currency = models.CharField(
        max_length=3,
        default="RWF",
    )

    minimum_quantity = models.DecimalField(
        max_digits=14,
        decimal_places=3,
        default=1,
        validators=[MinValueValidator(Decimal("0.001"))],
    )

    effective_from = models.DateTimeField(default=timezone.now)
    effective_until = models.DateTimeField(
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
    )

    notes = models.TextField(blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_prices",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pricing_prices"
        ordering = ["-effective_from"]
        indexes = [
            models.Index(
                fields=["product_variant_id", "price_type", "status"],
                name="pricing_variant_type_idx",
            ),
            models.Index(
                fields=["customer", "status"],
                name="pricing_customer_status_idx",
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(amount__gt=0),
                name="pricing_amount_positive",
            ),
        ]

    def clean(self):
        from django.core.exceptions import ValidationError

        if self.effective_until and self.effective_until <= self.effective_from:
            raise ValidationError({
                "effective_until": "The end date must be after the start date."
            })

        if self.price_type == self.PriceType.CUSTOMER and not self.customer_id:
            raise ValidationError({
                "customer": "Customer-specific prices require a customer."
            })

        if self.price_type != self.PriceType.CUSTOMER and self.customer_id:
            raise ValidationError({
                "customer": "Only customer-specific prices can have a customer."
            })

    def __str__(self):
        return f"{self.product_variant_id} - {self.amount} {self.currency}"


class Discount(models.Model):

    class DiscountType(models.TextChoices):
        PERCENTAGE = "PERCENTAGE", "Percentage"
        FIXED = "FIXED", "Fixed amount"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(max_length=150)
    code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
    )

    discount_type = models.CharField(
        max_length=20,
        choices=DiscountType.choices,
    )

    value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )

    product_variant_id = models.UUIDField(
        null=True,
        blank=True,
        db_index=True,
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="discounts",
    )

    minimum_order_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
    )

    starts_at = models.DateTimeField(default=timezone.now)
    ends_at = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_discounts",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pricing_discounts"
        ordering = ["-created_at"]

    def clean(self):
        from django.core.exceptions import ValidationError

        if self.discount_type == self.DiscountType.PERCENTAGE and self.value > 100:
            raise ValidationError({
                "value": "Percentage discounts cannot exceed 100."
            })

        if self.ends_at and self.ends_at <= self.starts_at:
            raise ValidationError({
                "ends_at": "The end date must be after the start date."
            })

    def __str__(self):
        return f"{self.name} ({self.code})"
