
import uuid
from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.customers.models import Customer
from apps.pricing.models import Price, Discount


def response_items(response):
    """Support both paginated and unpaginated DRF list responses."""
    if isinstance(response.data, dict) and "results" in response.data:
        return response.data["results"]

    return response.data


class PricingViewTestBase(APITestCase):

    def setUp(self):
        self.manager = self.create_user(
            "manager@example.com",
            User.Role.MANAGER,
        )

        self.sales_manager = self.create_user(
            "salesmanager@example.com",
            User.Role.SALES_MANAGER,
        )

        self.salesperson = self.create_user(
            "salesperson@example.com",
            User.Role.SALES_PERSON,
        )

        self.accountant = self.create_user(
            "accountant@example.com",
            User.Role.ACCOUNTANT,
        )

        self.storekeeper = self.create_user(
            "storekeeper@example.com",
            User.Role.STOREKEEPER,
        )

        self.inactive_user = self.create_user(
            "inactive@example.com",
            User.Role.MANAGER,
            is_active=False,
        )

        self.customer = Customer.objects.create(
            customer_number="CUS-VIEW-001",
            first_name="View",
            last_name="Customer",
            phone_number="+250788100003",
            email="viewcustomer@example.com",
        )

        self.product_variant_id = uuid.uuid4()

    def create_user(self, email, role, is_active=True):
        user = User.objects.create(
            email=email,
            first_name="Test",
            last_name="User",
            role=role,
            is_active=is_active,
        )
        user.set_password("testpassword123")
        user.save()
        return user

    def create_price(self, **overrides):
        data = {
            "product_variant_id": self.product_variant_id,
            "amount": Decimal("15000.00"),
            "currency": "RWF",
            "price_type": Price.PriceType.RETAIL,
            "minimum_quantity": Decimal("1.000"),
            "status": Price.Status.ACTIVE,
            "created_by": self.manager,
        }
        data.update(overrides)
        return Price.objects.create(**data)

    def create_discount(self, **overrides):
        data = {
            "name": "Summer Discount",
            "code": "SUMMER10",
            "discount_type": Discount.DiscountType.PERCENTAGE,
            "value": Decimal("10.00"),
            "status": Discount.Status.ACTIVE,
            "created_by": self.manager,
        }
        data.update(overrides)
        return Discount.objects.create(**data)


class PriceViewSetTests(PricingViewTestBase):

    def test_manager_can_list_prices(self):
        self.create_price()

        self.client.force_authenticate(user=self.manager)

        response = self.client.get(reverse("prices-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_items(response)), 1)

    def test_salesperson_can_list_prices(self):
        self.create_price()

        self.client.force_authenticate(user=self.salesperson)

        response = self.client.get(reverse("prices-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_storekeeper_can_list_prices(self):
        self.create_price()

        self.client.force_authenticate(user=self.storekeeper)

        response = self.client.get(reverse("prices-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_user_cannot_list_prices(self):
        response = self.client.get(reverse("prices-list"))

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_inactive_user_cannot_list_prices(self):
        self.client.force_authenticate(user=self.inactive_user)

        response = self.client.get(reverse("prices-list"))

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_manager_can_create_retail_price(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("prices-list"),
            {
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.RETAIL,
                "amount": "15000.00",
                "currency": "RWF",
                "minimum_quantity": "1.000",
                "status": Price.Status.ACTIVE,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        price = Price.objects.get(id=response.data["id"])

        self.assertEqual(price.amount, Decimal("15000.00"))
        self.assertEqual(price.created_by, self.manager)
        self.assertEqual(price.price_type, Price.PriceType.RETAIL)

    def test_sales_manager_can_create_price(self):
        self.client.force_authenticate(user=self.sales_manager)

        response = self.client.post(
            reverse("prices-list"),
            {
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.RETAIL,
                "amount": "12000.00",
                "currency": "RWF",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_accountant_can_create_price(self):
        self.client.force_authenticate(user=self.accountant)

        response = self.client.post(
            reverse("prices-list"),
            {
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.WHOLESALE,
                "amount": "11000.00",
                "currency": "RWF",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_salesperson_cannot_create_price(self):
        self.client.force_authenticate(user=self.salesperson)

        response = self.client.post(
            reverse("prices-list"),
            {
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.RETAIL,
                "amount": "15000.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_storekeeper_cannot_create_price(self):
        self.client.force_authenticate(user=self.storekeeper)

        response = self.client.post(
            reverse("prices-list"),
            {
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.RETAIL,
                "amount": "15000.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_price_creation_rejects_customer_specific_price_without_customer(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("prices-list"),
            {
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.CUSTOMER,
                "amount": "12000.00",
                "currency": "RWF",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("customer", response.data)

    def test_price_creation_accepts_customer_specific_price(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("prices-list"),
            {
                "product_variant_id": str(self.product_variant_id),
                "customer": str(self.customer.id),
                "price_type": Price.PriceType.CUSTOMER,
                "amount": "12000.00",
                "currency": "RWF",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        price = Price.objects.get(id=response.data["id"])

        self.assertEqual(price.customer, self.customer)
        self.assertEqual(price.created_by, self.manager)

    def test_price_creation_rejects_customer_for_retail_price(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("prices-list"),
            {
                "product_variant_id": str(self.product_variant_id),
                "customer": str(self.customer.id),
                "price_type": Price.PriceType.RETAIL,
                "amount": "12000.00",
                "currency": "RWF",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("customer", response.data)

    def test_price_creation_rejects_zero_amount(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("prices-list"),
            {
                "product_variant_id": str(self.product_variant_id),
                "price_type": Price.PriceType.RETAIL,
                "amount": "0.00",
                "currency": "RWF",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("amount", response.data)

    def test_manager_can_retrieve_price(self):
        price = self.create_price()

        self.client.force_authenticate(user=self.manager)

        response = self.client.get(
            reverse("prices-detail", kwargs={"pk": price.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(price.id))

    def test_manager_can_update_price(self):
        price = self.create_price()

        self.client.force_authenticate(user=self.manager)

        response = self.client.patch(
            reverse("prices-detail", kwargs={"pk": price.pk}),
            {
                "amount": "18000.00",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        price.refresh_from_db()

        self.assertEqual(price.amount, Decimal("18000.00"))

    def test_salesperson_cannot_update_price(self):
        price = self.create_price()

        self.client.force_authenticate(user=self.salesperson)

        response = self.client.patch(
            reverse("prices-detail", kwargs={"pk": price.pk}),
            {
                "amount": "18000.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_manager_can_delete_price(self):
        price = self.create_price()

        self.client.force_authenticate(user=self.manager)

        response = self.client.delete(
            reverse("prices-detail", kwargs={"pk": price.pk})
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Price.objects.filter(pk=price.pk).exists()
        )


class DiscountViewSetTests(PricingViewTestBase):

    def test_manager_can_list_discounts(self):
        self.create_discount()

        self.client.force_authenticate(user=self.manager)

        response = self.client.get(reverse("discounts-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_items(response)), 1)

    def test_salesperson_can_list_discounts(self):
        self.create_discount()

        self.client.force_authenticate(user=self.salesperson)

        response = self.client.get(reverse("discounts-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_storekeeper_can_list_discounts(self):
        self.create_discount()

        self.client.force_authenticate(user=self.storekeeper)

        response = self.client.get(reverse("discounts-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_user_cannot_list_discounts(self):
        response = self.client.get(reverse("discounts-list"))

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_inactive_user_cannot_list_discounts(self):
        self.client.force_authenticate(user=self.inactive_user)

        response = self.client.get(reverse("discounts-list"))

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_manager_can_create_percentage_discount(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("discounts-list"),
            {
                "name": "Summer Discount",
                "code": "SUMMER20",
                "discount_type": Discount.DiscountType.PERCENTAGE,
                "value": "20.00",
                "minimum_order_amount": "5000.00",
                "status": Discount.Status.ACTIVE,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        discount = Discount.objects.get(id=response.data["id"])

        self.assertEqual(discount.name, "Summer Discount")
        self.assertEqual(discount.value, Decimal("20.00"))
        self.assertEqual(discount.created_by, self.manager)

    def test_sales_manager_can_create_discount(self):
        self.client.force_authenticate(user=self.sales_manager)

        response = self.client.post(
            reverse("discounts-list"),
            {
                "name": "Sales Discount",
                "code": "SALES10",
                "discount_type": Discount.DiscountType.PERCENTAGE,
                "value": "10.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_accountant_can_create_discount(self):
        self.client.force_authenticate(user=self.accountant)

        response = self.client.post(
            reverse("discounts-list"),
            {
                "name": "Accountant Discount",
                "code": "ACCOUNT10",
                "discount_type": Discount.DiscountType.FIXED,
                "value": "1000.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_salesperson_cannot_create_discount(self):
        self.client.force_authenticate(user=self.salesperson)

        response = self.client.post(
            reverse("discounts-list"),
            {
                "name": "Salesperson Discount",
                "code": "SALESPERSON10",
                "discount_type": Discount.DiscountType.PERCENTAGE,
                "value": "10.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_storekeeper_cannot_create_discount(self):
        self.client.force_authenticate(user=self.storekeeper)

        response = self.client.post(
            reverse("discounts-list"),
            {
                "name": "Storekeeper Discount",
                "code": "STOREKEEPER10",
                "discount_type": Discount.DiscountType.PERCENTAGE,
                "value": "10.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_discount_creation_rejects_percentage_above_100(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("discounts-list"),
            {
                "name": "Invalid Discount",
                "code": "INVALID101",
                "discount_type": Discount.DiscountType.PERCENTAGE,
                "value": "101.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("value", response.data)

    def test_discount_creation_accepts_fixed_discount_above_100(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("discounts-list"),
            {
                "name": "Fixed Discount",
                "code": "FIXED150",
                "discount_type": Discount.DiscountType.FIXED,
                "value": "150.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_discount_creation_rejects_zero_value(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("discounts-list"),
            {
                "name": "Zero Discount",
                "code": "ZERO001",
                "discount_type": Discount.DiscountType.FIXED,
                "value": "0.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("value", response.data)

    def test_manager_can_retrieve_discount(self):
        discount = self.create_discount()

        self.client.force_authenticate(user=self.manager)

        response = self.client.get(
            reverse("discounts-detail", kwargs={"pk": discount.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(discount.id))

    def test_manager_can_update_discount(self):
        discount = self.create_discount()

        self.client.force_authenticate(user=self.manager)

        response = self.client.patch(
            reverse("discounts-detail", kwargs={"pk": discount.pk}),
            {
                "value": "15.00",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        discount.refresh_from_db()

        self.assertEqual(discount.value, Decimal("15.00"))

    def test_salesperson_cannot_update_discount(self):
        discount = self.create_discount()

        self.client.force_authenticate(user=self.salesperson)

        response = self.client.patch(
            reverse("discounts-detail", kwargs={"pk": discount.pk}),
            {
                "value": "15.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_manager_can_delete_discount(self):
        discount = self.create_discount()

        self.client.force_authenticate(user=self.manager)

        response = self.client.delete(
            reverse("discounts-detail", kwargs={"pk": discount.pk})
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Discount.objects.filter(pk=discount.pk).exists()
        )
