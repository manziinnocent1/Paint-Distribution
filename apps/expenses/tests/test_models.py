import pytest

from apps.expenses.models import Expense, ExpenseCategory


@pytest.mark.django_db
def test_create_expense_category():
    category = ExpenseCategory.objects.create(
        name="Rent",
        code="RENT",
        description="Business property rental costs.",
    )

    assert category.pk is not None
    assert category.name == "Rent"


@pytest.mark.django_db
def test_create_expense():
    category = ExpenseCategory.objects.create(
        name="Transport",
        code="TRANSPORT",
    )

    expense = Expense.objects.create(
        expense_number="EXP-TEST001",
        category=category,
        title="Product transportation",
        amount="100000.00",
        tax_amount="18000.00",
        currency="RWF",
        expense_date="2026-11-17",
    )

    assert expense.pk is not None
    assert expense.total_amount == 118000
    assert expense.status == Expense.Status.DRAFT