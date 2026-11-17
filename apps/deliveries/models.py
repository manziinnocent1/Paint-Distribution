import uuid

from django.conf import settings
from django.core.validators import MinValueValidator
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


class Delivery(UUIDTimestampModel):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PREPARING = "PREPARING", "Preparing"
        READY = "READY", "Ready for dispatch"
        ASSIGNED = "ASSIGNED", "Driver assigned"
        IN_TRANSIT = "IN_TRANSIT", "In transit"
        DELIVERED = "DELIVERED", "Delivered"
        FAILED = "FAILED", "Delivery failed"
        CANCELLED = "CANCELLED", "Cancelled"
        RETURNED = "RETURNED", "Returned"

    class VehicleType(models.TextChoices):
        MOTORCYCLE = "MOTORCYCLE", "Motorcycle"
        BICYCLE = "BICYCLE", "Bicycle"
        CAR = "CAR", "Car"
        VAN = "VAN", "Van"
        TRUCK = "TRUCK", "Truck"
        OTHER = "OTHER", "Other"

    delivery_number = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
    )

    tracking_number = models.CharField(
        max_length=60,
        unique=True,
        db_index=True,
    )

    order_reference = models.CharField(
        max_length=60,
        null=True,
        blank=True,
        db_index=True,
        help_text="Temporary order reference until the orders application is connected.",
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="deliveries",
    )

    delivery_address = models.ForeignKey(
        "customers.CustomerAddress",
        on_delete=models.PROTECT,
        related_name="deliveries",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    vehicle_type = models.CharField(
        max_length=20,
        choices=VehicleType.choices,
        default=VehicleType.OTHER,
    )

    vehicle_registration = models.CharField(
        max_length=40,
        blank=True,
    )

    driver_name = models.CharField(
        max_length=150,
        blank=True,
    )

    driver_phone = models.CharField(
        max_length=30,
        blank=True,
    )

    assigned_driver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_deliveries",
    )

    delivery_fee = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
    )

    estimated_delivery_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    dispatched_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    delivered_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    recipient_name = models.CharField(
        max_length=150,
        blank=True,
    )

    recipient_phone = models.CharField(
        max_length=30,
        blank=True,
    )

    delivery_notes = models.TextField(blank=True)

    failure_reason = models.TextField(blank=True)

    proof_of_delivery = models.ImageField(
        upload_to="deliveries/proof/",
        null=True,
        blank=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_deliveries",
    )

    class Meta:
        db_table = "deliveries_deliveries"
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["status", "created_at"],
                name="deliveries_status_created_idx",
            ),
            models.Index(
                fields=["customer", "created_at"],
                name="deliveries_customer_created_idx",
            ),
        ]

    def __str__(self):
        return f"{self.delivery_number} - {self.customer}"


class DeliveryStatusHistory(UUIDTimestampModel):
    delivery = models.ForeignKey(
        Delivery,
        on_delete=models.CASCADE,
        related_name="status_history",
    )

    previous_status = models.CharField(
        max_length=20,
        choices=Delivery.Status.choices,
        blank=True,
    )

    new_status = models.CharField(
        max_length=20,
        choices=Delivery.Status.choices,
    )

    note = models.TextField(blank=True)

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="delivery_status_updates",
    )

    class Meta:
        db_table = "deliveries_status_history"
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.delivery.delivery_number}: "
            f"{self.previous_status} → {self.new_status}"
        )