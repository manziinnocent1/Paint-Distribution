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


class ExpenseCategory(UUIDTimestampModel):
    name = models.CharField(
        max_length=120,
        unique=True,
    )

    code = models.CharField(
        max_length=40,
        unique=True,
    )

    description = models.TextField(blank=True)

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    class Meta:
        db_table = "expenses_categories"
        ordering = ["name"]
        verbose_name_plural = "Expense categories"

    def __str__(self):
        return self.name


class Expense(UUIDTimestampModel):

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        SUBMITTED = "SUBMITTED", "Submitted"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        PAID = "PAID", "Paid"
        CANCELLED = "CANCELLED", "Cancelled"

    class PaymentMethod(models.TextChoices):
        CASH = "CASH", "Cash"
        BANK_TRANSFER = "BANK_TRANSFER", "Bank transfer"
        MOBILE_MONEY = "MOBILE_MONEY", "Mobile money"
        CARD = "CARD", "Card"
        CHEQUE = "CHEQUE", "Cheque"
        OTHER = "OTHER", "Other"

    expense_number = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
    )

    category = models.ForeignKey(
        ExpenseCategory,
        on_delete=models.PROTECT,
        related_name="expenses",
    )

    title = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    supplier_name = models.CharField(
        max_length=200,
        blank=True,
        help_text="Temporary supplier name until the suppliers app is connected.",
    )

    supplier_reference = models.CharField(
        max_length=100,
        blank=True,
    )

    amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
    )

    tax_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
    )

    currency = models.CharField(
        max_length=3,
        default="RWF",
    )

    expense_date = models.DateField(db_index=True)

    due_date = models.DateField(
        null=True,
        blank=True,
    )

    payment_date = models.DateField(
        null=True,
        blank=True,
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        blank=True,
    )

    payment_reference = models.CharField(
        max_length=120,
        blank=True,
    )

    receipt = models.FileField(
        upload_to="expenses/receipts/%Y/%m/",
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
    )

    submitted_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    approved_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    paid_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    rejection_reason = models.TextField(blank=True)

    notes = models.TextField(blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_expenses",
    )

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_expenses",
    )

    paid_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="paid_expenses",
    )

    class Meta:
        db_table = "expenses_expenses"
        ordering = ["-expense_date", "-created_at"]

        indexes = [
            models.Index(
                fields=["status", "expense_date"],
                name="expenses_status_date_idx",
            ),
            models.Index(
                fields=["category", "expense_date"],
                name="expenses_category_date_idx",
            ),
        ]

    def __str__(self):
        return f"{self.expense_number} - {self.title}"

    @property
    def total_amount(self):
        return self.amount + self.tax_amount