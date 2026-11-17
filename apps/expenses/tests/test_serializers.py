
from datetime import date

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.expenses.models import Expense, ExpenseCategory
from apps.expenses.serializers import (
    ExpenseActionSerializer,
    ExpenseCategorySerializer,
    ExpenseSerializer,
)


User = get_user_model()


class ExpenseCategorySerializerTests(TestCase):

    def setUp(self):
        self.category = ExpenseCategory.objects.create(
            name="Office Supplies",
            code="OFFICE",
            description="Office-related expenses",
            is_active=True,
        )

    def test_serializes_category_fields(self):
        serializer = ExpenseCategorySerializer(self.category)

        self.assertEqual(serializer.data["name"], "Office Supplies")
        self.assertEqual(serializer.data["code"], "OFFICE")
        self.assertEqual(
            serializer.data["description"],
            "Office-related expenses",
        )
        self.assertTrue(serializer.data["is_active"])
        self.assertIn("id", serializer.data)
        self.assertIn("created_at", serializer.data)
        self.assertIn("updated_at", serializer.data)

    def test_category_id_and_timestamps_are_read_only(self):
        serializer = ExpenseCategorySerializer(
            self.category,
            data={
                "id": "00000000-0000-0000-0000-000000000001",
                "name": "Updated Supplies",
                "code": "UPDATED",
                "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_category = serializer.save()

        self.assertEqual(updated_category.name, "Updated Supplies")
        self.assertEqual(updated_category.code, "UPDATED")
        self.assertEqual(updated_category.pk, self.category.pk)


class ExpenseSerializerTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="accountant@example.com",
            password="TestPassword123!",
            role="accountant",
        )

        self.category = ExpenseCategory.objects.create(
            name="Transport",
            code="TRANSPORT",
            description="Transport expenses",
        )

        self.expense = Expense.objects.create(
            expense_number="EXP-TEST000001",
            category=self.category,
            title="Business transport",
            description="Transport for a business meeting",
            supplier_name="ABC Transport",
            supplier_reference="SUP-001",
            amount="10000.00",
            tax_amount="1800.00",
            currency="RWF",
            expense_date=date(2026, 1, 15),
            created_by=self.user,
        )

    def test_serializes_expense_fields(self):
        serializer = ExpenseSerializer(self.expense)

        self.assertEqual(serializer.data["expense_number"], "EXP-TEST000001")
        self.assertEqual(serializer.data["title"], "Business transport")
        self.assertEqual(serializer.data["category_name"], "Transport")
        self.assertEqual(serializer.data["amount"], "10000.00")
        self.assertEqual(serializer.data["tax_amount"], "1800.00")
        self.assertEqual(serializer.data["total_amount"], "11800.00")
        self.assertEqual(
            serializer.data["created_by_email"],
            "accountant@example.com",
        )

    def test_total_amount_is_calculated_correctly(self):
        self.assertEqual(self.expense.total_amount, 11800)

    def test_expense_number_is_read_only(self):
        serializer = ExpenseSerializer(
            self.expense,
            data={
                "expense_number": "EXP-CHANGED",
                "title": "Updated transport expense",
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_expense = serializer.save()

        self.assertEqual(
            updated_expense.expense_number,
            "EXP-TEST000001",
        )
        self.assertEqual(
            updated_expense.title,
            "Updated transport expense",
        )

    def test_status_is_read_only(self):
        serializer = ExpenseSerializer(
            self.expense,
            data={
                "status": Expense.Status.PAID,
                "title": "Updated expense",
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_expense = serializer.save()

        self.assertEqual(updated_expense.status, Expense.Status.DRAFT)

    def test_created_by_is_read_only(self):
        another_user = User.objects.create_user(
            email="another@example.com",
            password="TestPassword123!",
            role="accountant",
        )

        serializer = ExpenseSerializer(
            self.expense,
            data={
                "created_by": str(another_user.pk),
                "title": "Updated expense",
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_expense = serializer.save()

        self.assertEqual(updated_expense.created_by, self.user)

    def test_rejects_zero_amount(self):
        serializer = ExpenseSerializer(
            data={
                "category": str(self.category.pk),
                "title": "Invalid expense",
                "amount": "0.00",
                "tax_amount": "0.00",
                "expense_date": "2026-01-15",
            },
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_rejects_negative_amount(self):
        serializer = ExpenseSerializer(
            data={
                "category": str(self.category.pk),
                "title": "Invalid expense",
                "amount": "-100.00",
                "tax_amount": "0.00",
                "expense_date": "2026-01-15",
            },
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_rejects_negative_tax_amount(self):
        serializer = ExpenseSerializer(
            data={
                "category": str(self.category.pk),
                "title": "Invalid tax expense",
                "amount": "1000.00",
                "tax_amount": "-50.00",
                "expense_date": "2026-01-15",
            },
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("tax_amount", serializer.errors)

    def test_accepts_zero_tax_amount(self):
        serializer = ExpenseSerializer(
            data={
                "category": str(self.category.pk),
                "title": "Expense without tax",
                "amount": "1000.00",
                "tax_amount": "0.00",
                "expense_date": "2026-01-15",
            },
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_accepts_valid_expense_data(self):
        serializer = ExpenseSerializer(
            data={
                "category": str(self.category.pk),
                "title": "Electricity bill",
                "description": "Monthly electricity bill",
                "supplier_name": "Electricity Provider",
                "amount": "25000.00",
                "tax_amount": "4500.00",
                "currency": "RWF",
                "expense_date": "2026-01-15",
                "due_date": "2026-01-30",
                "notes": "January payment",
            },
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)


class ExpenseActionSerializerTests(TestCase):

    def test_accepts_valid_action_data(self):
        serializer = ExpenseActionSerializer(
            data={
                "note": "Reviewed",
                "rejection_reason": "",
                "payment_method": Expense.PaymentMethod.BANK_TRANSFER,
                "payment_reference": "BANK-REF-001",
                "payment_date": "2026-01-20",
            },
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_all_action_fields_are_optional(self):
        serializer = ExpenseActionSerializer(data={})

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_rejects_invalid_payment_method(self):
        serializer = ExpenseActionSerializer(
            data={
                "payment_method": "BITCOIN",
            },
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("payment_method", serializer.errors)

    def test_rejects_invalid_payment_date(self):
        serializer = ExpenseActionSerializer(
            data={
                "payment_date": "not-a-date",
            },
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("payment_date", serializer.errors)
