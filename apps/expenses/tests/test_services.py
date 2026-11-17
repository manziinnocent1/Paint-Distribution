import pytest

from django.core.exceptions import ValidationError

from apps.expenses.models import Expense, ExpenseCategory
from apps.expenses.services import (
    submit_expense,
    approve_expense,
    reject_expense,
    mark_expense_paid,
)


@pytest.mark.django_db
def test_expense_approval_and_payment_workflow():
    category = ExpenseCategory.objects.create(
        name="Utilities",
        code="UTILITIES",
    )

    expense = Expense.objects.create(
        expense_number="EXP-WORKFLOW001",
        category=category,
        title="Electricity bill",
        amount="50000.00",
        expense_date="2026-11-17",
    )

    expense = submit_expense(expense=expense, user=None)
    assert expense.status == Expense.Status.SUBMITTED

    expense = approve_expense(expense=expense, user=None)
    assert expense.status == Expense.Status.APPROVED

    expense = mark_expense_paid(
        expense=expense,
        user=None,
        payment_method=Expense.PaymentMethod.BANK_TRANSFER,
        payment_reference="BANK-001",
    )

    assert expense.status == Expense.Status.PAID


@pytest.mark.django_db
def test_draft_expense_cannot_be_approved():
    category = ExpenseCategory.objects.create(
        name="Maintenance",
        code="MAINTENANCE",
    )

    expense = Expense.objects.create(
        expense_number="EXP-WORKFLOW002",
        category=category,
        title="Equipment repair",
        amount="25000.00",
        expense_date="2026-11-17",
    )

    with pytest.raises(ValidationError):
        approve_expense(expense=expense, user=None)


@pytest.mark.django_db
def test_submitted_expense_can_be_rejected():
    category = ExpenseCategory.objects.create(
        name="Utilities",
        code="UTILITIES-2",
    )

    expense = Expense.objects.create(
        expense_number="EXP-WORKFLOW003",
        category=category,
        title="Water bill",
        amount="15000.00",
        expense_date="2026-11-17",
    )

    expense = submit_expense(expense=expense, user=None)

    expense = reject_expense(
        expense=expense,
        user=None,
        reason="Incorrect supporting documentation.",
    )

    assert expense.status == Expense.Status.REJECTED
    assert expense.rejection_reason