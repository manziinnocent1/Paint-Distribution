
import uuid
from datetime import timedelta
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.test import TestCase
from django.utils import timezone

from apps.accounts.models import User
from apps.customers.models import Customer
from apps.pricing.models import Price, Discount


class PricingTestBase(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            email="pricing@example.com",
            first_name="Pricing",
            last_name="Tester",
            role=User.Role.MANAGER,
        )

        self.customer = Customer.objects.create(
            customer_number="CUS-PRICE-001",
            first_name="John",
            last_name="Customer",
            phone_number="+250788100001",
            email="customer@example.com",
        )

        self.product_variant_id = uuid.uuid4()

    def create_price(self, **overrides):
        data = {
            "product_variant_id": self.product_variant_id,
            "amount": Decimal("15000.00"),
            "currency": "RWF",
            "price_type": Price.PriceType.RETAIL,
            "minimum_quantity": Decimal("1.000"),
            "status": Price.Status.DRAFT,
            "created_by": self.user,
        }
        data.update(overrides)
        return Price.objects.create(**data)

    def create_discount(self, **overrides):
        data = {
            "name": "Summer Discount",
            "code": "SUMMER10",
            "discount_type": Discount.DiscountType.PERCENTAGE,
            "value": Decimal("10.00"),
            "status": Discount.Status.DRAFT,
            "created_by": self.user,
        }
        data.update(overrides)
        return Discount.objects.create(**data)


class PriceModelTests(PricingTestBase):

    def test_price_is_created_successfully(self):
        price = self.create_price()

        self.assertIsInstance(price.id, uuid.UUID)
        self.assertEqual(
            price.product_variant_id,
            self.product_variant_id,
        )
        self.assertEqual(price.amount, Decimal("15000.00"))
        self.assertEqual(price.currency, "RWF")
        self.assertEqual(price.price_type, Price.PriceType.RETAIL)
        self.assertEqual(price.status, Price.Status.DRAFT)
        self.assertEqual(price.created_by, self.user)

    def test_price_default_currency_is_rwf(self):
        price = self.create_price()

        self.assertEqual(price.currency, "RWF")

    def test_price_default_type_is_retail(self):
        price = Price.objects.create(
            product_variant_id=self.product_variant_id,
            amount=Decimal("10000.00"),
            created_by=self.user,
        )

        self.assertEqual(price.price_type, Price.PriceType.RETAIL)

    def test_price_default_status_is_draft(self):
        price = self.create_price()

        self.assertEqual(price.status, Price.Status.DRAFT)

    def test_price_default_minimum_quantity_is_one(self):
        price = self.create_price()

        self.assertEqual(
            price.minimum_quantity,
            Decimal("1.000"),
        )

    def test_price_default_effective_from_is_set(self):
        price = self.create_price()

        self.assertIsNotNone(price.effective_from)

    def test_price_string_representation(self):
        price = self.create_price()

        self.assertEqual(
            str(price),
            f"{self.product_variant_id} - 15000.00 RWF",
        )

    def test_price_customer_specific_type_requires_customer(self):
        price = Price(
            product_variant_id=self.product_variant_id,
            price_type=Price.PriceType.CUSTOMER,
            amount=Decimal("12000.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError) as context:
            price.full_clean()

        self.assertIn("customer", context.exception.message_dict)

    def test_customer_specific_price_accepts_customer(self):
        price = Price(
            product_variant_id=self.product_variant_id,
            customer=self.customer,
            price_type=Price.PriceType.CUSTOMER,
            amount=Decimal("12000.00"),
            created_by=self.user,
        )

        price.full_clean()

        self.assertEqual(price.customer, self.customer)

    def test_retail_price_cannot_have_customer(self):
        price = Price(
            product_variant_id=self.product_variant_id,
            customer=self.customer,
            price_type=Price.PriceType.RETAIL,
            amount=Decimal("12000.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError) as context:
            price.full_clean()

        self.assertIn("customer", context.exception.message_dict)

    def test_wholesale_price_cannot_have_customer(self):
        price = Price(
            product_variant_id=self.product_variant_id,
            customer=self.customer,
            price_type=Price.PriceType.WHOLESALE,
            amount=Decimal("12000.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError) as context:
            price.full_clean()

        self.assertIn("customer", context.exception.message_dict)

    def test_effective_until_must_be_after_effective_from(self):
        start = timezone.now()

        price = Price(
            product_variant_id=self.product_variant_id,
            amount=Decimal("12000.00"),
            effective_from=start,
            effective_until=start - timedelta(days=1),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError) as context:
            price.full_clean()

        self.assertIn("effective_until", context.exception.message_dict)

    def test_valid_effective_date_range(self):
        start = timezone.now()

        price = Price(
            product_variant_id=self.product_variant_id,
            amount=Decimal("12000.00"),
            effective_from=start,
            effective_until=start + timedelta(days=30),
            created_by=self.user,
        )

        price.full_clean()

        self.assertGreater(price.effective_until, price.effective_from)

    def test_price_amount_database_constraint_rejects_zero(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                self.create_price(amount=Decimal("0.00"))

    def test_price_ordering_uses_effective_from_descending(self):
        self.assertEqual(
            Price._meta.ordering,
            ["-effective_from"],
        )

    def test_price_can_be_associated_with_customer(self):
        price = self.create_price(
            customer=self.customer,
            price_type=Price.PriceType.CUSTOMER,
        )

        self.assertIn(price, self.customer.custom_prices.all())


class DiscountModelTests(PricingTestBase):

    def test_discount_is_created_successfully(self):
        discount = self.create_discount()

        self.assertIsInstance(discount.id, uuid.UUID)
        self.assertEqual(discount.name, "Summer Discount")
        self.assertEqual(discount.code, "SUMMER10")
        self.assertEqual(
            discount.discount_type,
            Discount.DiscountType.PERCENTAGE,
        )
        self.assertEqual(discount.value, Decimal("10.00"))
        self.assertEqual(discount.status, Discount.Status.DRAFT)
        self.assertEqual(discount.created_by, self.user)

    def test_discount_string_representation(self):
        discount = self.create_discount()

        self.assertEqual(
            str(discount),
            "Summer Discount (SUMMER10)",
        )

    def test_percentage_discount_cannot_exceed_100(self):
        discount = Discount(
            name="Invalid Discount",
            code="INVALID100",
            discount_type=Discount.DiscountType.PERCENTAGE,
            value=Decimal("101.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError) as context:
            discount.full_clean()

        self.assertIn("value", context.exception.message_dict)

    def test_percentage_discount_of_100_is_valid(self):
        discount = Discount(
            name="Full Discount",
            code="FULL100",
            discount_type=Discount.DiscountType.PERCENTAGE,
            value=Decimal("100.00"),
            created_by=self.user,
        )

        discount.full_clean()

        self.assertEqual(discount.value, Decimal("100.00"))

    def test_fixed_discount_can_exceed_100(self):
        discount = Discount(
            name="Fixed Discount",
            code="FIXED150",
            discount_type=Discount.DiscountType.FIXED,
            value=Decimal("150.00"),
            created_by=self.user,
        )

        discount.full_clean()

        self.assertEqual(discount.value, Decimal("150.00"))

    def test_discount_end_date_must_be_after_start_date(self):
        start = timezone.now()

        discount = Discount(
            name="Invalid Date Discount",
            code="INVALIDDATE",
            discount_type=Discount.DiscountType.FIXED,
            value=Decimal("500.00"),
            starts_at=start,
            ends_at=start - timedelta(days=1),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError) as context:
            discount.full_clean()

        self.assertIn("ends_at", context.exception.message_dict)

    def test_valid_discount_date_range(self):
        start = timezone.now()

        discount = Discount(
            name="Valid Date Discount",
            code="VALIDDATE",
            discount_type=Discount.DiscountType.FIXED,
            value=Decimal("500.00"),
            starts_at=start,
            ends_at=start + timedelta(days=30),
            created_by=self.user,
        )

        discount.full_clean()

        self.assertGreater(discount.ends_at, discount.starts_at)

    def test_discount_default_status_is_draft(self):
        discount = self.create_discount()

        self.assertEqual(discount.status, Discount.Status.DRAFT)

    def test_discount_code_must_be_unique(self):
        self.create_discount()

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                self.create_discount(
                    name="Another Discount",
                    code="SUMMER10",
                )

    def test_discount_can_be_associated_with_customer(self):
        discount = self.create_discount(customer=self.customer)

        self.assertIn(discount, self.customer.discounts.all())

    def test_discount_ordering_is_newest_first(self):
        self.assertEqual(
            Discount._meta.ordering,
            ["-created_at"],
        )
