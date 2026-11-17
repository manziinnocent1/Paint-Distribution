import uuid

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from apps.expenses.models import Expense


@transaction.atomic
def create_expense(*, data, user):
    expense = Expense.objects.create(
        expense_number=f"EXP-{uuid.uuid4().hex[:12].upper()}",
        created_by=user,
        **data,
    )

    return expense


@transaction.atomic
def submit_expense(*, expense, user):
    expense = Expense.objects.select_for_update().get(pk=expense.pk)

    if expense.status != Expense.Status.DRAFT:
        raise ValidationError(
            "Only draft expenses can be submitted."
        )

    expense.status = Expense.Status.SUBMITTED
    expense.submitted_at = timezone.now()
    expense.save(
        update_fields=[
            "status",
            "submitted_at",
            "updated_at",
        ]
    )

    return expense


@transaction.atomic
def approve_expense(*, expense, user):
    expense = Expense.objects.select_for_update().get(pk=expense.pk)

    if expense.status != Expense.Status.SUBMITTED:
        raise ValidationError(
            "Only submitted expenses can be approved."
        )

    expense.status = Expense.Status.APPROVED
    expense.approved_by = user
    expense.approved_at = timezone.now()

    expense.save(
        update_fields=[
            "status",
            "approved_by",
            "approved_at",
            "updated_at",
        ]
    )

    return expense


@transaction.atomic
def reject_expense(*, expense, user, reason):
    expense = Expense.objects.select_for_update().get(pk=expense.pk)

    if expense.status != Expense.Status.SUBMITTED:
        raise ValidationError(
            "Only submitted expenses can be rejected."
        )

    if not reason.strip():
        raise ValidationError(
            "A rejection reason is required."
        )

    expense.status = Expense.Status.REJECTED
    expense.approved_by = user
    expense.approved_at = timezone.now()
    expense.rejection_reason = reason

    expense.save(
        update_fields=[
            "status",
            "approved_by",
            "approved_at",
            "rejection_reason",
            "updated_at",
        ]
    )

    return expense


@transaction.atomic
def mark_expense_paid(
    *,
    expense,
    user,
    payment_method,
    payment_reference="",
    payment_date=None,
):
    expense = Expense.objects.select_for_update().get(pk=expense.pk)

    if expense.status != Expense.Status.APPROVED:
        raise ValidationError(
            "Only approved expenses can be marked as paid."
        )

    expense.status = Expense.Status.PAID
    expense.paid_by = user
    expense.paid_at = timezone.now()
    expense.payment_method = payment_method
    expense.payment_reference = payment_reference
    expense.payment_date = payment_date or timezone.localdate()

    expense.save(
        update_fields=[
            "status",
            "paid_by",
            "paid_at",
            "payment_method",
            "payment_reference",
            "payment_date",
            "updated_at",
        ]
    )

    return expense


@transaction.atomic
def cancel_expense(*, expense):
    expense = Expense.objects.select_for_update().get(pk=expense.pk)

    if expense.status in {
        Expense.Status.PAID,
        Expense.Status.CANCELLED,
    }:
        raise ValidationError(
            "Paid or already cancelled expenses cannot be cancelled."
        )

    expense.status = Expense.Status.CANCELLED
    expense.save(update_fields=["status", "updated_at"])

    return expense