
from datetime import date

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.expenses.models import Expense, ExpenseCategory


User = get_user_model()


class ExpenseAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.manager = User.objects.create_user(
            email="manager@example.com",
            password="TestPassword123!",
            role="manager",
        )

        self.accountant = User.objects.create_user(
            email="accountant@example.com",
            password="TestPassword123!",
            role="accountant",
        )

        self.sales_user = User.objects.create_user(
            email="sales@example.com",
            password="TestPassword123!",
            role="sales_person",
        )

        self.category = ExpenseCategory.objects.create(
            name="Office Supplies",
            code="OFFICE",
            description="Office-related expenses",
        )

        self.expense = self.create_expense()

        self.client.force_authenticate(user=self.accountant)

    def create_expense(self, **kwargs):
        data = {
            "expense_number": "EXP-TEST000001",
            "category": self.category,
            "title": "Office equipment",
            "description": "Purchase of office equipment",
            "supplier_name": "ABC Supplies",
            "supplier_reference": "SUP-001",
            "amount": "10000.00",
            "tax_amount": "1800.00",
            "currency": "RWF",
            "expense_date": date(2026, 1, 15),
            "status": Expense.Status.DRAFT,
            "created_by": self.accountant,
        }
        data.update(kwargs)

        return Expense.objects.create(**data)

    def get_results(self, response):
        """
        Supports both paginated and unpaginated DRF list responses.
        """
        if isinstance(response.data, dict) and "results" in response.data:
            return response.data["results"]

        return response.data

    # ---------------------------------------------------------
    # Authentication and permissions
    # ---------------------------------------------------------

    def test_unauthenticated_user_cannot_list_expenses(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(reverse("expenses-list"))

        self.assertIn(
            response.status_code,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
        )

    def test_accountant_can_list_expenses(self):
        response = self.client.get(reverse("expenses-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_manager_can_list_expenses(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.get(reverse("expenses-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_sales_user_cannot_list_expenses(self):
        self.client.force_authenticate(user=self.sales_user)

        response = self.client.get(reverse("expenses-list"))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_sales_user_cannot_create_expense(self):
        self.client.force_authenticate(user=self.sales_user)

        response = self.client.post(
            reverse("expenses-list"),
            {
                "category": str(self.category.pk),
                "title": "Office rent",
                "amount": "50000.00",
                "tax_amount": "0.00",
                "expense_date": "2026-01-15",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ---------------------------------------------------------
    # Expense category endpoints
    # ---------------------------------------------------------

    def test_list_expense_categories(self):
        response = self.client.get(
            reverse("expense-categories-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        categories = self.get_results(response)

        self.assertTrue(
            any(
                category["code"] == "OFFICE"
                for category in categories
            )
        )

    def test_create_expense_category(self):
        response = self.client.post(
            reverse("expense-categories-list"),
            {
                "name": "Transport",
                "code": "TRANSPORT",
                "description": "Transport expenses",
                "is_active": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertTrue(
            ExpenseCategory.objects.filter(
                code="TRANSPORT"
            ).exists()
        )

    def test_retrieve_expense_category(self):
        response = self.client.get(
            reverse(
                "expense-categories-detail",
                kwargs={"pk": self.category.pk},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Office Supplies")

    def test_update_expense_category(self):
        response = self.client.patch(
            reverse(
                "expense-categories-detail",
                kwargs={"pk": self.category.pk},
            ),
            {
                "name": "Updated Office Supplies",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.category.refresh_from_db()

        self.assertEqual(
            self.category.name,
            "Updated Office Supplies",
        )

    def test_delete_expense_category_without_expenses(self):
        category = ExpenseCategory.objects.create(
            name="Temporary Category",
            code="TEMP",
        )

        response = self.client.delete(
            reverse(
                "expense-categories-detail",
                kwargs={"pk": category.pk},
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            ExpenseCategory.objects.filter(pk=category.pk).exists()
        )

    def test_cannot_delete_category_with_existing_expenses(self):
        response = self.client.delete(
            reverse(
                "expense-categories-detail",
                kwargs={"pk": self.category.pk},
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertTrue(
            ExpenseCategory.objects.filter(pk=self.category.pk).exists()
        )

    # ---------------------------------------------------------
    # Expense CRUD endpoints
    # ---------------------------------------------------------

    def test_list_expenses(self):
        response = self.client.get(reverse("expenses-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expenses = self.get_results(response)

        self.assertTrue(
            any(
                expense["expense_number"] == "EXP-TEST000001"
                for expense in expenses
            )
        )

    def test_create_expense(self):
        response = self.client.post(
            reverse("expenses-list"),
            {
                "category": str(self.category.pk),
                "title": "Monthly electricity",
                "description": "Electricity payment",
                "supplier_name": "Electricity Provider",
                "supplier_reference": "ELEC-001",
                "amount": "25000.00",
                "tax_amount": "4500.00",
                "currency": "RWF",
                "expense_date": "2026-01-20",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        created_expense = Expense.objects.get(
            title="Monthly electricity"
        )

        self.assertTrue(
            created_expense.expense_number.startswith("EXP-")
        )
        self.assertEqual(
            created_expense.created_by,
            self.accountant,
        )
        self.assertEqual(
            created_expense.status,
            Expense.Status.DRAFT,
        )

    def test_create_expense_rejects_zero_amount(self):
        response = self.client.post(
            reverse("expenses-list"),
            {
                "category": str(self.category.pk),
                "title": "Invalid expense",
                "amount": "0.00",
                "tax_amount": "0.00",
                "expense_date": "2026-01-20",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("amount", response.data)

    def test_create_expense_rejects_negative_tax(self):
        response = self.client.post(
            reverse("expenses-list"),
            {
                "category": str(self.category.pk),
                "title": "Invalid tax expense",
                "amount": "1000.00",
                "tax_amount": "-100.00",
                "expense_date": "2026-01-20",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("tax_amount", response.data)

    def test_retrieve_expense(self):
        response = self.client.get(
            reverse(
                "expenses-detail",
                kwargs={"pk": self.expense.pk},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["expense_number"],
            "EXP-TEST000001",
        )

    def test_update_expense(self):
        response = self.client.patch(
            reverse(
                "expenses-detail",
                kwargs={"pk": self.expense.pk},
            ),
            {
                "title": "Updated office equipment",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.expense.refresh_from_db()

        self.assertEqual(
            self.expense.title,
            "Updated office equipment",
        )

    def test_delete_expense(self):
        response = self.client.delete(
            reverse(
                "expenses-detail",
                kwargs={"pk": self.expense.pk},
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Expense.objects.filter(pk=self.expense.pk).exists()
        )

    def test_search_expenses_by_title(self):
        response = self.client.get(
            reverse("expenses-list"),
            {"search": "Office equipment"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expenses = self.get_results(response)

        self.assertTrue(
            any(
                expense["title"] == "Office equipment"
                for expense in expenses
            )
        )

    # ---------------------------------------------------------
    # Submit action
    # ---------------------------------------------------------

    def test_submit_draft_expense(self):
        response = self.client.post(
            reverse(
                "expenses-submit",
                kwargs={"pk": self.expense.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.expense.refresh_from_db()

        self.assertEqual(
            self.expense.status,
            Expense.Status.SUBMITTED,
        )
        self.assertIsNotNone(self.expense.submitted_at)

    def test_cannot_submit_expense_twice(self):
        self.expense.status = Expense.Status.SUBMITTED
        self.expense.save(update_fields=["status"])

        response = self.client.post(
            reverse(
                "expenses-submit",
                kwargs={"pk": self.expense.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    # ---------------------------------------------------------
    # Approve action
    # ---------------------------------------------------------

    def test_manager_can_approve_submitted_expense(self):
        self.expense.status = Expense.Status.SUBMITTED
        self.expense.save(update_fields=["status"])

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "expenses-approve",
                kwargs={"pk": self.expense.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.expense.refresh_from_db()

        self.assertEqual(
            self.expense.status,
            Expense.Status.APPROVED,
        )
        self.assertEqual(self.expense.approved_by, self.manager)
        self.assertIsNotNone(self.expense.approved_at)

    def test_cannot_approve_draft_expense(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "expenses-approve",
                kwargs={"pk": self.expense.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    # ---------------------------------------------------------
    # Reject action
    # ---------------------------------------------------------

    def test_manager_can_reject_submitted_expense(self):
        self.expense.status = Expense.Status.SUBMITTED
        self.expense.save(update_fields=["status"])

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "expenses-reject",
                kwargs={"pk": self.expense.pk},
            ),
            {
                "rejection_reason": "The expense does not have sufficient supporting documents.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.expense.refresh_from_db()

        self.assertEqual(
            self.expense.status,
            Expense.Status.REJECTED,
        )
        self.assertEqual(
            self.expense.rejection_reason,
            "The expense does not have sufficient supporting documents.",
        )
        self.assertEqual(self.expense.approved_by, self.manager)
        self.assertIsNotNone(self.expense.approved_at)

    def test_reject_requires_a_reason(self):
        self.expense.status = Expense.Status.SUBMITTED
        self.expense.save(update_fields=["status"])

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "expenses-reject",
                kwargs={"pk": self.expense.pk},
            ),
            {
                "rejection_reason": "   ",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.expense.refresh_from_db()

        self.assertEqual(
            self.expense.status,
            Expense.Status.SUBMITTED,
        )

    # ---------------------------------------------------------
    # Mark paid action
    # ---------------------------------------------------------

    def test_manager_can_mark_approved_expense_as_paid(self):
        self.expense.status = Expense.Status.APPROVED
        self.expense.approved_by = self.manager
        self.expense.save(
            update_fields=["status", "approved_by"]
        )

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "expenses-mark-paid",
                kwargs={"pk": self.expense.pk},
            ),
            {
                "payment_method": Expense.PaymentMethod.BANK_TRANSFER,
                "payment_reference": "BANK-REF-001",
                "payment_date": "2026-01-25",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.expense.refresh_from_db()

        self.assertEqual(
            self.expense.status,
            Expense.Status.PAID,
        )
        self.assertEqual(self.expense.paid_by, self.manager)
        self.assertIsNotNone(self.expense.paid_at)
        self.assertEqual(
            self.expense.payment_method,
            Expense.PaymentMethod.BANK_TRANSFER,
        )
        self.assertEqual(
            self.expense.payment_reference,
            "BANK-REF-001",
        )
        self.assertEqual(
            self.expense.payment_date,
            date(2026, 1, 25),
        )

    def test_mark_paid_requires_payment_method(self):
        self.expense.status = Expense.Status.APPROVED
        self.expense.save(update_fields=["status"])

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "expenses-mark-paid",
                kwargs={"pk": self.expense.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("payment_method", response.data)

    def test_cannot_mark_draft_expense_as_paid(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "expenses-mark-paid",
                kwargs={"pk": self.expense.pk},
            ),
            {
                "payment_method": Expense.PaymentMethod.CASH,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    # ---------------------------------------------------------
    # Cancel action
    # ---------------------------------------------------------

    def test_can_cancel_draft_expense(self):
        response = self.client.post(
            reverse(
                "expenses-cancel",
                kwargs={"pk": self.expense.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.expense.refresh_from_db()

        self.assertEqual(
            self.expense.status,
            Expense.Status.CANCELLED,
        )

    def test_can_cancel_submitted_expense(self):
        self.expense.status = Expense.Status.SUBMITTED
        self.expense.save(update_fields=["status"])

        response = self.client.post(
            reverse(
                "expenses-cancel",
                kwargs={"pk": self.expense.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.expense.refresh_from_db()

        self.assertEqual(
            self.expense.status,
            Expense.Status.CANCELLED,
        )

    def test_cannot_cancel_paid_expense(self):
        self.expense.status = Expense.Status.PAID
        self.expense.save(update_fields=["status"])

        response = self.client.post(
            reverse(
                "expenses-cancel",
                kwargs={"pk": self.expense.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.expense.refresh_from_db()

        self.assertEqual(
            self.expense.status,
            Expense.Status.PAID,
        )

    def test_cannot_cancel_already_cancelled_expense(self):
        self.expense.status = Expense.Status.CANCELLED
        self.expense.save(update_fields=["status"])

        response = self.client.post(
            reverse(
                "expenses-cancel",
                kwargs={"pk": self.expense.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
