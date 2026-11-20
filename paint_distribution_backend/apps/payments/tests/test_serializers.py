
from decimal import Decimal

from django.test import TestCase

from apps.accounts.models import User
from apps.customers.models import Customer
from apps.payments.models import Payment, PaymentRefund
from apps.payments.serializers import (
    PaymentSerializer,
    PaymentRefundSerializer,
    RefundCreateSerializer,
)


class PaymentSerializerTests(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            email="serializer@example.com",
            first_name="Serializer",
            last_name="Tester",
            role=User.Role.ACCOUNTANT,
        )
        self.user.set_password("testpassword123")
        self.user.save()

        self.customer = Customer.objects.create(
            customer_number="CUS-SER-001",
            first_name="Alice",
            last_name="Example",
            phone_number="+250788000003",
            email="alice@example.com",
        )

        self.payment = Payment.objects.create(
            payment_number="PAY-SER-001",
            customer=self.customer,
            amount=Decimal("25000.00"),
            currency="RWF",
            payment_method=Payment.PaymentMethod.BANK_TRANSFER,
            initiated_by=self.user,
        )

    def test_payment_serializer_contains_expected_fields(self):
        serializer = PaymentSerializer(instance=self.payment)

        expected_fields = {
            "id",
            "payment_number",
            "customer",
            "customer_name",
            "order_reference",
            "amount",
            "currency",
            "payment_method",
            "status",
            "transaction_reference",
            "provider_reference",
            "provider_response",
            "notes",
            "initiated_by",
            "confirmed_by",
            "paid_at",
            "created_at",
            "updated_at",
        }

        self.assertEqual(set(serializer.data.keys()), expected_fields)

    def test_payment_serializer_returns_customer_name(self):
        serializer = PaymentSerializer(instance=self.payment)

        self.assertEqual(
            serializer.data["customer_name"],
            str(self.customer),
        )

    def test_payment_serializer_returns_payment_amount(self):
        serializer = PaymentSerializer(instance=self.payment)

        self.assertEqual(
            serializer.data["amount"],
            "25000.00",
        )

    def test_payment_serializer_validates_positive_amount(self):
        serializer = PaymentSerializer(
            data={
                "customer": str(self.customer.id),
                "amount": "1000.00",
                "currency": "RWF",
                "payment_method": Payment.PaymentMethod.CASH,
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_payment_serializer_rejects_zero_amount(self):
        serializer = PaymentSerializer(
            data={
                "customer": str(self.customer.id),
                "amount": "0.00",
                "currency": "RWF",
                "payment_method": Payment.PaymentMethod.CASH,
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_payment_serializer_rejects_negative_amount(self):
        serializer = PaymentSerializer(
            data={
                "customer": str(self.customer.id),
                "amount": "-100.00",
                "currency": "RWF",
                "payment_method": Payment.PaymentMethod.CASH,
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_payment_generated_fields_are_read_only(self):
        serializer = PaymentSerializer()

        read_only_fields = [
            "id",
            "payment_number",
            "status",
            "initiated_by",
            "confirmed_by",
            "paid_at",
            "provider_response",
            "created_at",
            "updated_at",
        ]

        for field_name in read_only_fields:
            with self.subTest(field=field_name):
                self.assertTrue(
                    serializer.fields[field_name].read_only
                )


class PaymentRefundSerializerTests(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            email="refundserializer@example.com",
            first_name="Refund",
            last_name="Tester",
            role=User.Role.ACCOUNTANT,
        )
        self.user.set_password("testpassword123")
        self.user.save()

        self.customer = Customer.objects.create(
            customer_number="CUS-SER-002",
            first_name="Bob",
            last_name="Example",
            phone_number="+250788000004",
        )

        self.payment = Payment.objects.create(
            payment_number="PAY-SER-002",
            customer=self.customer,
            amount=Decimal("30000.00"),
            currency="RWF",
            payment_method=Payment.PaymentMethod.CASH,
            status=Payment.Status.COMPLETED,
            initiated_by=self.user,
        )

        self.refund = PaymentRefund.objects.create(
            payment=self.payment,
            refund_number="REF-SER-001",
            amount=Decimal("5000.00"),
            reason="Incorrect payment.",
            processed_by=self.user,
        )

    def test_refund_serializer_contains_expected_fields(self):
        serializer = PaymentRefundSerializer(instance=self.refund)

        expected_fields = {
            "id",
            "payment",
            "refund_number",
            "amount",
            "reason",
            "status",
            "processed_by",
            "processed_at",
            "created_at",
        }

        self.assertEqual(set(serializer.data.keys()), expected_fields)

    def test_refund_serializer_returns_refund_amount(self):
        serializer = PaymentRefundSerializer(instance=self.refund)

        self.assertEqual(serializer.data["amount"], "5000.00")

    def test_refund_generated_fields_are_read_only(self):
        serializer = PaymentRefundSerializer()

        read_only_fields = [
            "id",
            "refund_number",
            "status",
            "processed_by",
            "processed_at",
            "created_at",
        ]

        for field_name in read_only_fields:
            with self.subTest(field=field_name):
                self.assertTrue(
                    serializer.fields[field_name].read_only
                )


class RefundCreateSerializerTests(TestCase):

    def test_valid_refund_data(self):
        serializer = RefundCreateSerializer(
            data={
                "amount": "5000.00",
                "reason": "Customer requested a refund.",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(
            serializer.validated_data["amount"],
            Decimal("5000.00"),
        )

    def test_rejects_zero_refund_amount(self):
        serializer = RefundCreateSerializer(
            data={
                "amount": "0.00",
                "reason": "Invalid refund.",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_rejects_negative_refund_amount(self):
        serializer = RefundCreateSerializer(
            data={
                "amount": "-100.00",
                "reason": "Invalid refund.",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_reason_is_required(self):
        serializer = RefundCreateSerializer(
            data={
                "amount": "1000.00",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("reason", serializer.errors)

    def test_amount_is_required(self):
        serializer = RefundCreateSerializer(
            data={
                "reason": "Customer requested a refund.",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)
