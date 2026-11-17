
import uuid
from datetime import timedelta
from decimal import Decimal

from django.test import TestCase
from django.utils import timezone

from apps.accounts.models import User
from apps.customers.models import Customer
from apps.pricing.models import Price, Discount
from apps.pricing.serializers import (
    PriceSerializer,
    DiscountSerializer,
)


class PricingSerializerTestBase(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            email="serializer@example.com",
            first_name="Serializer",
            last_name="Tester",
            role=User.Role.MANAGER,
        )

        self.customer = Customer.objects.create(
            customer_number="CUS-SER-001",
            first_name="Jane",
            last_name="Customer",
            phone_number="+250788100002",
        )

        self.product_variant_id = uuid.uuid4()


class PriceSerializerTests(PricingSerializerTestBase):

    def test_price_serializer_contains_expected_fields(self):
        serializer = PriceSerializer()

        expected_fields = {
            "id",
            "product_variant_id",
            "customer",
            "price_type",
            "amount",
            "currency",
            "minimum_quantity",
            "effective_from",
            "effective_until",
            "status",
            "notes",
            "created_by",
            "created_at",
            "updated_at",
        }

        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_price_serializer_accepts_valid_retail_price(self):
        serializer = PriceSerializer(
            data={
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.RETAIL,
                "amount": "15000.00",
                "currency": "RWF",
                "minimum_quantity": "1.000",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_price_serializer_accepts_valid_wholesale_price(self):
        serializer = PriceSerializer(
            data={
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.WHOLESALE,
                "amount": "12000.00",
                "currency": "RWF",
                "minimum_quantity": "10.000",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_price_serializer_accepts_customer_specific_price(self):
        serializer = PriceSerializer(
            data={
                "product_variant_id": str(self.product_variant_id),
                "customer": str(self.customer.id),
                "price_type": Price.PriceType.CUSTOMER,
                "amount": "11000.00",
                "currency": "RWF",
                "minimum_quantity": "1.000",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_customer_specific_price_requires_customer(self):
        serializer = PriceSerializer(
            data={
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.CUSTOMER,
                "amount": "11000.00",
                "currency": "RWF",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("customer", serializer.errors)

    def test_retail_price_rejects_customer(self):
        serializer = PriceSerializer(
            data={
                "product_variant_id": str(self.product_variant_id),
                "customer": str(self.customer.id),
                "price_type": Price.PriceType.RETAIL,
                "amount": "15000.00",
                "currency": "RWF",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("customer", serializer.errors)

    def test_wholesale_price_rejects_customer(self):
        serializer = PriceSerializer(
            data={
                "product_variant_id": str(self.product_variant_id),
                "customer": str(self.customer.id),
                "price_type": Price.PriceType.WHOLESALE,
                "amount": "12000.00",
                "currency": "RWF",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("customer", serializer.errors)

    def test_price_serializer_rejects_zero_amount(self):
        serializer = PriceSerializer(
            data={
                "product_variant_id": str(self.product_variant_id),
                "amount": "0.00",
                "price_type": Price.PriceType.RETAIL,
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_price_serializer_rejects_negative_amount(self):
        serializer = PriceSerializer(
            data={
                "product_variant_id": str(self.product_variant_id),
                "amount": "-100.00",
                "price_type": Price.PriceType.RETAIL,
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_price_serializer_rejects_invalid_effective_date_range(self):
        start = timezone.now()

        serializer = PriceSerializer(
            data={
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.RETAIL,
                "amount": "15000.00",
                "effective_from": start.isoformat(),
                "effective_until": (
                    start - timedelta(days=1)
                ).isoformat(),
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("effective_until", serializer.errors)

    def test_price_serializer_accepts_valid_effective_date_range(self):
        start = timezone.now()

        serializer = PriceSerializer(
            data={
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.RETAIL,
                "amount": "15000.00",
                "effective_from": start.isoformat(),
                "effective_until": (
                    start + timedelta(days=30)
                ).isoformat(),
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_price_generated_fields_are_read_only(self):
        serializer = PriceSerializer()

        for field_name in [
            "id",
            "created_by",
            "created_at",
            "updated_at",
        ]:
            with self.subTest(field=field_name):
                self.assertTrue(
                    serializer.fields[field_name].read_only
                )


class DiscountSerializerTests(PricingSerializerTestBase):

    def test_discount_serializer_contains_expected_fields(self):
        serializer = DiscountSerializer()

        expected_fields = {
            "id",
            "name",
            "code",
            "discount_type",
            "value",
            "product_variant_id",
            "customer",
            "minimum_order_amount",
            "starts_at",
            "ends_at",
            "status",
            "created_by",
            "created_at",
            "updated_at",
        }

        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_discount_serializer_accepts_valid_percentage_discount(self):
        serializer = DiscountSerializer(
            data={
                "name": "Summer Discount",
                "code": "SUMMER10",
                "discount_type": Discount.DiscountType.PERCENTAGE,
                "value": "10.00",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_discount_serializer_accepts_100_percent_discount(self):
        serializer = DiscountSerializer(
            data={
                "name": "Full Discount",
                "code": "FULL100",
                "discount_type": Discount.DiscountType.PERCENTAGE,
                "value": "100.00",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_discount_serializer_rejects_percentage_above_100(self):
        serializer = DiscountSerializer(
            data={
                "name": "Invalid Discount",
                "code": "INVALID101",
                "discount_type": Discount.DiscountType.PERCENTAGE,
                "value": "101.00",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("value", serializer.errors)

    def test_discount_serializer_accepts_fixed_discount_above_100(self):
        serializer = DiscountSerializer(
            data={
                "name": "Fixed Discount",
                "code": "FIXED150",
                "discount_type": Discount.DiscountType.FIXED,
                "value": "150.00",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_discount_serializer_rejects_zero_value(self):
        serializer = DiscountSerializer(
            data={
                "name": "Zero Discount",
                "code": "ZERO001",
                "discount_type": Discount.DiscountType.FIXED,
                "value": "0.00",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("value", serializer.errors)

    def test_discount_generated_fields_are_read_only(self):
        serializer = DiscountSerializer()

        for field_name in [
            "id",
            "created_by",
            "created_at",
            "updated_at",
        ]:
            with self.subTest(field=field_name):
                self.assertTrue(
                    serializer.fields[field_name].read_only
                )
