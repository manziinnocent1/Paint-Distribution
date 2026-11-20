
import uuid
from decimal import Decimal

from django.test import TestCase

from apps.accounts.models import User
from apps.customers.models import Customer
from apps.payments.models import Payment, PaymentRefund


class PaymentModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            email="initiator@example.com",
            first_name="Payment",
            last_name="Initiator",
            role=User.Role.ACCOUNTANT,
        )
        self.user.set_password("testpassword123")
        self.user.save()

        self.customer = Customer.objects.create(
            customer_number="CUS-001",
            first_name="John",
            last_name="Doe",
            phone_number="+250788000001",
            email="john@example.com",
        )

    def create_payment(self, **overrides):
        data = {
            "payment_number": "PAY-TEST-001",
            "customer": self.customer,
            "amount": Decimal("15000.00"),
            "currency": "RWF",
            "payment_method": Payment.PaymentMethod.CASH,
            "initiated_by": self.user,
        }
        data.update(overrides)
        return Payment.objects.create(**data)

    def test_payment_is_created_successfully(self):
        payment = self.create_payment()

        self.assertIsInstance(payment.id, uuid.UUID)
        self.assertEqual(payment.payment_number, "PAY-TEST-001")
        self.assertEqual(payment.customer, self.customer)
        self.assertEqual(payment.amount, Decimal("15000.00"))
        self.assertEqual(payment.currency, "RWF")
        self.assertEqual(
            payment.payment_method,
            Payment.PaymentMethod.CASH,
        )
        self.assertEqual(payment.status, Payment.Status.PENDING)
        self.assertEqual(payment.initiated_by, self.user)

    def test_payment_default_status_is_pending(self):
        payment = self.create_payment()

        self.assertEqual(payment.status, Payment.Status.PENDING)

    def test_payment_default_currency_is_rwf(self):
        payment = self.create_payment()

        self.assertEqual(payment.currency, "RWF")

    def test_payment_default_provider_response_is_empty_dictionary(self):
        payment = self.create_payment()

        self.assertEqual(payment.provider_response, {})

    def test_payment_string_representation(self):
        payment = self.create_payment()

        self.assertEqual(
            str(payment),
            "PAY-TEST-001 - 15000.00 RWF",
        )

    def test_payment_number_must_be_unique(self):
        self.create_payment()

        with self.assertRaises(Exception):
            self.create_payment(
                payment_number="PAY-TEST-001",
            )

    def test_payment_ordering_is_newest_first(self):
        first_payment = self.create_payment(
            payment_number="PAY-TEST-002",
        )
        second_payment = self.create_payment(
            payment_number="PAY-TEST-003",
        )

        payments = list(Payment.objects.all())

        self.assertEqual(payments[0], second_payment)
        self.assertEqual(payments[1], first_payment)


class PaymentRefundModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            email="refund@example.com",
            first_name="Refund",
            last_name="Processor",
            role=User.Role.ACCOUNTANT,
        )
        self.user.set_password("testpassword123")
        self.user.save()

        self.customer = Customer.objects.create(
            customer_number="CUS-002",
            first_name="Jane",
            last_name="Smith",
            phone_number="+250788000002",
            email="jane@example.com",
        )

        self.payment = Payment.objects.create(
            payment_number="PAY-REFUND-001",
            customer=self.customer,
            amount=Decimal("50000.00"),
            currency="RWF",
            payment_method=Payment.PaymentMethod.MTN_MOMO,
            status=Payment.Status.COMPLETED,
            initiated_by=self.user,
        )

    def create_refund(self, **overrides):
        data = {
            "payment": self.payment,
            "refund_number": "REF-TEST-001",
            "amount": Decimal("10000.00"),
            "reason": "Customer requested a refund.",
            "processed_by": self.user,
        }
        data.update(overrides)
        return PaymentRefund.objects.create(**data)

    def test_refund_is_created_successfully(self):
        refund = self.create_refund()

        self.assertIsInstance(refund.id, uuid.UUID)
        self.assertEqual(refund.payment, self.payment)
        self.assertEqual(refund.refund_number, "REF-TEST-001")
        self.assertEqual(refund.amount, Decimal("10000.00"))
        self.assertEqual(
            refund.reason,
            "Customer requested a refund.",
        )
        self.assertEqual(refund.status, PaymentRefund.Status.PENDING)
        self.assertEqual(refund.processed_by, self.user)

    def test_refund_default_status_is_pending(self):
        refund = self.create_refund()

        self.assertEqual(refund.status, PaymentRefund.Status.PENDING)

    def test_refund_string_representation(self):
        refund = self.create_refund()

        self.assertEqual(str(refund), "REF-TEST-001")

    def test_refund_number_must_be_unique(self):
        self.create_refund()

        with self.assertRaises(Exception):
            self.create_refund(
                refund_number="REF-TEST-001",
            )

    def test_payment_can_have_multiple_refunds(self):
        first_refund = self.create_refund(
            refund_number="REF-TEST-002",
        )
        second_refund = self.create_refund(
            refund_number="REF-TEST-003",
        )

        self.assertEqual(self.payment.refunds.count(), 2)
        self.assertIn(first_refund, self.payment.refunds.all())
        self.assertIn(second_refund, self.payment.refunds.all())
