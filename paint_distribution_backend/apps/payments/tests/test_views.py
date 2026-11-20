from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.customers.models import Customer
from apps.payments.models import Payment, PaymentRefund


def results_of(response):
    """
    Return the list of items from a list response, whether or not the
    endpoint is paginated. A paginated response is a dict with
    count/next/previous/results, which is why len(response.data) was 4.
    """
    data = response.data
    if isinstance(data, dict) and "results" in data:
        return data["results"]
    return data


class PaymentViewSetTests(APITestCase):

    def setUp(self):
        self.manager = self.create_user(
            email="manager@example.com",
            role=User.Role.MANAGER,
        )

        self.salesperson = self.create_user(
            email="salesperson@example.com",
            role=User.Role.SALES_PERSON,
        )

        self.storekeeper = self.create_user(
            email="storekeeper@example.com",
            role=User.Role.STOREKEEPER,
        )

        self.inactive_manager = self.create_user(
            email="inactive@example.com",
            role=User.Role.MANAGER,
            is_active=False,
        )

        self.customer = Customer.objects.create(
            customer_number="CUS-VIEW-001",
            first_name="John",
            last_name="Customer",
            phone_number="+250788000005",
            email="customer@example.com",
        )

        self.payment = self.create_payment(
            payment_number="PAY-VIEW-001",
            amount=Decimal("20000.00"),
            status=Payment.Status.PENDING,
        )

    def create_user(
        self,
        email,
        role,
        is_active=True,
        is_superuser=False,
    ):
        user = User.objects.create(
            email=email,
            first_name="Test",
            last_name="User",
            role=role,
            is_active=is_active,
            is_superuser=is_superuser,
        )
        user.set_password("testpassword123")
        user.save()
        return user

    def create_payment(self, **overrides):
        data = {
            "payment_number": "PAY-VIEW-TEST",
            "customer": self.customer,
            "amount": Decimal("10000.00"),
            "currency": "RWF",
            "payment_method": Payment.PaymentMethod.CASH,
            "status": Payment.Status.PENDING,
            "initiated_by": self.manager,
        }
        data.update(overrides)
        return Payment.objects.create(**data)

    def test_manager_can_list_payments(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.get(
            reverse("payments-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(results_of(response)), 1)

    def test_salesperson_can_list_payments(self):
        self.client.force_authenticate(user=self.salesperson)

        response = self.client.get(
            reverse("payments-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_storekeeper_cannot_list_payments(self):
        self.client.force_authenticate(user=self.storekeeper)

        response = self.client.get(
            reverse("payments-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_unauthenticated_user_cannot_list_payments(self):
        response = self.client.get(
            reverse("payments-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_inactive_user_cannot_list_payments(self):
        self.client.force_authenticate(user=self.inactive_manager)

        response = self.client.get(
            reverse("payments-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_manager_can_create_payment(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("payments-list"),
            {
                "customer": str(self.customer.id),
                "amount": "15000.00",
                "currency": "RWF",
                "payment_method": Payment.PaymentMethod.MTN_MOMO,
                "transaction_reference": "TXN-001",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertTrue(
            Payment.objects.filter(
                customer=self.customer,
                amount=Decimal("15000.00"),
            ).exists()
        )

        created_payment = Payment.objects.get(
            payment_number=response.data["payment_number"]
        )

        self.assertTrue(
            created_payment.payment_number.startswith("PAY-")
        )
        self.assertEqual(
            created_payment.initiated_by,
            self.manager,
        )
        self.assertEqual(
            created_payment.status,
            Payment.Status.PENDING,
        )

    def test_salesperson_can_create_payment(self):
        self.client.force_authenticate(user=self.salesperson)

        response = self.client.post(
            reverse("payments-list"),
            {
                "customer": str(self.customer.id),
                "amount": "8000.00",
                "currency": "RWF",
                "payment_method": Payment.PaymentMethod.CASH,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_storekeeper_cannot_create_payment(self):
        self.client.force_authenticate(user=self.storekeeper)

        response = self.client.post(
            reverse("payments-list"),
            {
                "customer": str(self.customer.id),
                "amount": "8000.00",
                "currency": "RWF",
                "payment_method": Payment.PaymentMethod.CASH,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_payment_creation_rejects_invalid_amount(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("payments-list"),
            {
                "customer": str(self.customer.id),
                "amount": "0.00",
                "currency": "RWF",
                "payment_method": Payment.PaymentMethod.CASH,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("amount", response.data)

    def test_manager_can_confirm_pending_payment(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-confirm",
                kwargs={"pk": self.payment.pk},
            ),
            {
                "transaction_reference": "TXN-CONFIRM-001",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.payment.refresh_from_db()

        self.assertEqual(
            self.payment.status,
            Payment.Status.COMPLETED,
        )
        self.assertEqual(
            self.payment.confirmed_by,
            self.manager,
        )
        self.assertIsNotNone(self.payment.paid_at)
        self.assertEqual(
            self.payment.transaction_reference,
            "TXN-CONFIRM-001",
        )

    def test_manager_can_confirm_processing_payment(self):
        self.payment.status = Payment.Status.PROCESSING
        self.payment.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-confirm",
                kwargs={"pk": self.payment.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.payment.refresh_from_db()

        self.assertEqual(
            self.payment.status,
            Payment.Status.COMPLETED,
        )

    def test_confirming_completed_payment_is_idempotent(self):
        self.payment.status = Payment.Status.COMPLETED
        self.payment.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-confirm",
                kwargs={"pk": self.payment.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cannot_confirm_failed_payment(self):
        self.payment.status = Payment.Status.FAILED
        self.payment.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-confirm",
                kwargs={"pk": self.payment.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_only_manager_can_confirm_payment(self):
        self.client.force_authenticate(user=self.salesperson)

        response = self.client.post(
            reverse(
                "payments-confirm",
                kwargs={"pk": self.payment.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_manager_can_fail_pending_payment(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-fail",
                kwargs={"pk": self.payment.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.payment.refresh_from_db()

        self.assertEqual(
            self.payment.status,
            Payment.Status.FAILED,
        )

    def test_manager_can_fail_processing_payment(self):
        self.payment.status = Payment.Status.PROCESSING
        self.payment.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-fail",
                kwargs={"pk": self.payment.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.payment.refresh_from_db()

        self.assertEqual(
            self.payment.status,
            Payment.Status.FAILED,
        )

    def test_cannot_fail_completed_payment(self):
        self.payment.status = Payment.Status.COMPLETED
        self.payment.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-fail",
                kwargs={"pk": self.payment.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_only_manager_can_fail_payment(self):
        self.client.force_authenticate(user=self.salesperson)

        response = self.client.post(
            reverse(
                "payments-fail",
                kwargs={"pk": self.payment.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_manager_can_create_refund_for_completed_payment(self):
        self.payment.status = Payment.Status.COMPLETED
        self.payment.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-refund",
                kwargs={"pk": self.payment.pk},
            ),
            {
                "amount": "5000.00",
                "reason": "Customer requested a refund.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        refund = PaymentRefund.objects.get(
            refund_number=response.data["refund_number"]
        )

        self.assertEqual(refund.payment, self.payment)
        self.assertEqual(refund.amount, Decimal("5000.00"))
        self.assertEqual(refund.status, PaymentRefund.Status.PENDING)
        self.assertEqual(refund.processed_by, self.manager)

    def test_manager_can_create_refund_for_partially_refunded_payment(self):
        self.payment.status = Payment.Status.PARTIALLY_REFUNDED
        self.payment.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-refund",
                kwargs={"pk": self.payment.pk},
            ),
            {
                "amount": "5000.00",
                "reason": "Additional refund.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_cannot_refund_pending_payment(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-refund",
                kwargs={"pk": self.payment.pk},
            ),
            {
                "amount": "5000.00",
                "reason": "Refund request.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_refund_amount_cannot_exceed_payment_amount(self):
        self.payment.status = Payment.Status.COMPLETED
        self.payment.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-refund",
                kwargs={"pk": self.payment.pk},
            ),
            {
                "amount": "25000.00",
                "reason": "Excessive refund.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_refund_rejects_zero_amount(self):
        self.payment.status = Payment.Status.COMPLETED
        self.payment.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-refund",
                kwargs={"pk": self.payment.pk},
            ),
            {
                "amount": "0.00",
                "reason": "Invalid refund.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_refund_requires_reason(self):
        self.payment.status = Payment.Status.COMPLETED
        self.payment.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payments-refund",
                kwargs={"pk": self.payment.pk},
            ),
            {
                "amount": "5000.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_only_manager_can_create_refund(self):
        self.payment.status = Payment.Status.COMPLETED
        self.payment.save()

        self.client.force_authenticate(user=self.salesperson)

        response = self.client.post(
            reverse(
                "payments-refund",
                kwargs={"pk": self.payment.pk},
            ),
            {
                "amount": "5000.00",
                "reason": "Refund request.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )


class PaymentRefundViewSetTests(APITestCase):

    def setUp(self):
        self.manager = self.create_user(
            "refundmanager@example.com",
            User.Role.MANAGER,
        )

        self.salesperson = self.create_user(
            "refundsales@example.com",
            User.Role.SALES_PERSON,
        )

        self.customer = Customer.objects.create(
            customer_number="CUS-REF-VIEW-001",
            first_name="Refund",
            last_name="Customer",
            phone_number="+250788000006",
        )

        self.payment = Payment.objects.create(
            payment_number="PAY-REF-VIEW-001",
            customer=self.customer,
            amount=Decimal("40000.00"),
            currency="RWF",
            payment_method=Payment.PaymentMethod.CASH,
            status=Payment.Status.COMPLETED,
            initiated_by=self.manager,
        )

        self.refund = PaymentRefund.objects.create(
            payment=self.payment,
            refund_number="REF-VIEW-001",
            amount=Decimal("10000.00"),
            reason="Customer requested a refund.",
        )

    def create_user(self, email, role):
        user = User.objects.create(
            email=email,
            first_name="Test",
            last_name="User",
            role=role,
        )
        user.set_password("testpassword123")
        user.save()
        return user

    def test_manager_can_list_refunds(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.get(
            reverse("payment-refunds-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(results_of(response)), 1)

    def test_salesperson_cannot_list_refunds(self):
        self.client.force_authenticate(user=self.salesperson)

        response = self.client.get(
            reverse("payment-refunds-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_manager_can_retrieve_refund(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.get(
            reverse(
                "payment-refunds-detail",
                kwargs={"pk": self.refund.pk},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["refund_number"],
            self.refund.refund_number,
        )

    def test_manager_can_complete_pending_refund(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payment-refunds-complete",
                kwargs={"pk": self.refund.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.refund.refresh_from_db()
        self.payment.refresh_from_db()

        self.assertEqual(
            self.refund.status,
            PaymentRefund.Status.COMPLETED,
        )
        self.assertEqual(self.refund.processed_by, self.manager)
        self.assertIsNotNone(self.refund.processed_at)

        self.assertEqual(
            self.payment.status,
            Payment.Status.PARTIALLY_REFUNDED,
        )

    def test_completing_full_refund_marks_payment_refunded(self):
        self.refund.amount = Decimal("40000.00")
        self.refund.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payment-refunds-complete",
                kwargs={"pk": self.refund.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.payment.refresh_from_db()

        self.assertEqual(
            self.payment.status,
            Payment.Status.REFUNDED,
        )

    def test_completing_already_completed_refund_is_idempotent(self):
        self.refund.status = PaymentRefund.Status.COMPLETED
        self.refund.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payment-refunds-complete",
                kwargs={"pk": self.refund.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cannot_complete_failed_refund(self):
        self.refund.status = PaymentRefund.Status.FAILED
        self.refund.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse(
                "payment-refunds-complete",
                kwargs={"pk": self.refund.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_only_manager_can_complete_refund(self):
        self.client.force_authenticate(user=self.salesperson)

        response = self.client.post(
            reverse(
                "payment-refunds-complete",
                kwargs={"pk": self.refund.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_refund_viewset_does_not_allow_post_to_list(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("payment-refunds-list"),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )