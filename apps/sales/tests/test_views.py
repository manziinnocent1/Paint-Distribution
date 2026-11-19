from decimal import Decimal
from unittest.mock import patch

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.catalog.models import Category, Product, ProductVariant
from apps.customers.models import Customer
from apps.inventory.models import Warehouse

from apps.sales.models import (
    SalesQuotation,
    Sale,
    SaleItem,
    SalesReturn,
)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def sales_user(db):
    return User.objects.create_user(
        email="sales-view@example.com",
        password="TestPassword123!",
        first_name="Sales",
        last_name="User",
        role="sales_person",
    )


@pytest.fixture
def manager_user(db):
    return User.objects.create_user(
        email="manager-view@example.com",
        password="TestPassword123!",
        first_name="Sales",
        last_name="Manager",
        role="sales_manager",
    )


@pytest.fixture
def inventory_user(db):
    return User.objects.create_user(
        email="inventory-view@example.com",
        password="TestPassword123!",
        first_name="Inventory",
        last_name="User",
        role="inventory_manager",
    )


@pytest.fixture
def accountant_user(db):
    return User.objects.create_user(
        email="accountant-view@example.com",
        password="TestPassword123!",
        first_name="Account",
        last_name="User",
        role="accountant",
    )


@pytest.fixture
def customer(db):
    return Customer.objects.create(
        customer_number="CUS-VIEW-001",
        first_name="View",
        last_name="Customer",
        phone_number="+250788000010",
        status=Customer.Status.ACTIVE,
    )


@pytest.fixture
def warehouse(db):
    return Warehouse.objects.create(
        name="Sales View Warehouse",
        code="WH-VIEW-001",
        status=Warehouse.Status.ACTIVE,
    )


@pytest.fixture
def product_variant(db):
    category = Category.objects.create(
        name="View Paint",
        slug="view-paint",
    )

    product = Product.objects.create(
        name="Premium Paint",
        slug="premium-paint",
        product_code="PREM-VIEW-001",
        category=category,
        status=Product.Status.ACTIVE,
        tax_rate=Decimal("18.00"),
    )

    return ProductVariant.objects.create(
        product=product,
        name="20 Litre Premium White",
        sku="PREM-VIEW-001-20L",
        selling_price=Decimal("50000.00"),
        cost_price=Decimal("30000.00"),
        is_active=True,
    )


@pytest.fixture
def quotation(db, customer, warehouse, sales_user):
    return SalesQuotation.objects.create(
        quotation_number="QUO-VIEW-001",
        customer=customer,
        warehouse=warehouse,
        quotation_date=timezone.localdate(),
        valid_until=timezone.localdate() + timezone.timedelta(days=7),
        created_by=sales_user,
    )


@pytest.fixture
def sale(db, customer, warehouse, sales_user):
    return Sale.objects.create(
        sale_number="SALE-VIEW-001",
        customer=customer,
        warehouse=warehouse,
        sale_date=timezone.localdate(),
        created_by=sales_user,
    )


@pytest.fixture
def sale_item(db, sale, product_variant):
    return SaleItem.objects.create(
        sale=sale,
        product_variant=product_variant,
        product_name=product_variant.product.name,
        variant_name=product_variant.name,
        sku=product_variant.sku,
        quantity=Decimal("10.000"),
        unit_price=Decimal("50000.00"),
        quantity_fulfilled=Decimal("0.000"),
    )


@pytest.fixture
def sales_return(db, sale, sales_user):
    return SalesReturn.objects.create(
        return_number="RET-VIEW-001",
        sale=sale,
        reason="Customer reported damaged packaging",
        requested_by=sales_user,
    )


@pytest.mark.django_db
class TestSalesQuotationViews:

    def test_sales_user_can_list_quotations(
        self,
        api_client,
        sales_user,
        quotation,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.get(
            reverse("sales-quotation-list")
        )

        assert response.status_code == 200

    def test_unauthenticated_user_cannot_list_quotations(
        self,
        api_client,
    ):
        response = api_client.get(
            reverse("sales-quotation-list")
        )

        assert response.status_code == 401

    def test_sales_user_can_retrieve_quotation(
        self,
        api_client,
        sales_user,
        quotation,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.get(
            reverse(
                "sales-quotation-detail",
                kwargs={"pk": quotation.pk},
            )
        )

        assert response.status_code == 200
        assert response.data["quotation_number"] == quotation.quotation_number

    def test_sales_user_can_create_quotation(
        self,
        api_client,
        sales_user,
        customer,
        warehouse,
        product_variant,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse("sales-quotation-list"),
            {
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "quotation_date": str(timezone.localdate()),
                "valid_until": str(
                    timezone.localdate() + timezone.timedelta(days=7)
                ),
                "items": [
                    {
                        "product_variant": str(product_variant.pk),
                        "quantity": 2,
                        "discount_amount": "0.00",
                    }
                ],
            },
            format="json",
        )

        assert response.status_code == 201
        assert SalesQuotation.objects.filter(
            quotation_number=response.data["quotation_number"]
        ).exists()

    def test_create_quotation_rejects_empty_items(
        self,
        api_client,
        sales_user,
        customer,
        warehouse,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse("sales-quotation-list"),
            {
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "valid_until": str(timezone.localdate()),
                "items": [],
            },
            format="json",
        )

        assert response.status_code == 400
        assert "items" in response.data

    def test_sales_user_can_send_draft_quotation(
        self,
        api_client,
        sales_user,
        quotation,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse(
                "sales-quotation-send",
                kwargs={"pk": quotation.pk},
            ),
            {},
            format="json",
        )

        assert response.status_code == 200

        quotation.refresh_from_db()
        assert quotation.status == SalesQuotation.Status.SENT

    def test_cannot_send_non_draft_quotation(
        self,
        api_client,
        sales_user,
        quotation,
    ):
        quotation.status = SalesQuotation.Status.ACCEPTED
        quotation.save(update_fields=["status"])

        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse(
                "sales-quotation-send",
                kwargs={"pk": quotation.pk},
            ),
            {},
            format="json",
        )

        assert response.status_code == 400

    def test_can_accept_sent_quotation(
        self,
        api_client,
        sales_user,
        quotation,
    ):
        quotation.status = SalesQuotation.Status.SENT
        quotation.save(update_fields=["status"])

        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse(
                "sales-quotation-accept",
                kwargs={"pk": quotation.pk},
            ),
            {},
            format="json",
        )

        assert response.status_code == 200

        quotation.refresh_from_db()
        assert quotation.status == SalesQuotation.Status.ACCEPTED

    def test_can_reject_sent_quotation(
        self,
        api_client,
        sales_user,
        quotation,
    ):
        quotation.status = SalesQuotation.Status.SENT
        quotation.save(update_fields=["status"])

        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse(
                "sales-quotation-reject",
                kwargs={"pk": quotation.pk},
            ),
            {},
            format="json",
        )

        assert response.status_code == 200

        quotation.refresh_from_db()
        assert quotation.status == SalesQuotation.Status.REJECTED


@pytest.mark.django_db
class TestSaleViews:

    def test_sales_user_can_list_sales(
        self,
        api_client,
        sales_user,
        sale,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.get(
            reverse("sale-list")
        )

        assert response.status_code == 200

    def test_unauthenticated_user_cannot_list_sales(self, api_client):
        response = api_client.get(reverse("sale-list"))

        assert response.status_code == 401

    def test_sales_user_can_retrieve_sale(
        self,
        api_client,
        sales_user,
        sale,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.get(
            reverse("sale-detail", kwargs={"pk": sale.pk})
        )

        assert response.status_code == 200
        assert response.data["sale_number"] == sale.sale_number

    def test_sales_user_can_create_sale(
        self,
        api_client,
        sales_user,
        customer,
        warehouse,
        product_variant,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse("sale-list"),
            {
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "sales_channel": Sale.SalesChannel.DIRECT,
                "sale_date": str(timezone.localdate()),
                "items": [
                    {
                        "product_variant": str(product_variant.pk),
                        "quantity": 2,
                        "discount_amount": "0.00",
                    }
                ],
            },
            format="json",
        )

        assert response.status_code == 201

        created_sale = Sale.objects.get(
            sale_number=response.data["sale_number"]
        )

        assert created_sale.created_by == sales_user
        assert created_sale.items.count() == 1
        assert created_sale.subtotal == Decimal("100000.00")
        assert created_sale.tax_amount == Decimal("18000.00")
        assert created_sale.total_amount == Decimal("118000.00")

    def test_create_sale_rejects_empty_items(
        self,
        api_client,
        sales_user,
        customer,
        warehouse,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse("sale-list"),
            {
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "items": [],
            },
            format="json",
        )

        assert response.status_code == 400

    def test_sales_user_can_confirm_draft_sale(
        self,
        api_client,
        sales_user,
        sale,
        sale_item,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse("sale-confirm", kwargs={"pk": sale.pk}),
            {},
            format="json",
        )

        assert response.status_code == 200

        sale.refresh_from_db()
        assert sale.status == Sale.Status.CONFIRMED
        assert sale.confirmed_by == sales_user
        assert sale.confirmed_at is not None

    def test_cannot_confirm_sale_without_items(
        self,
        api_client,
        sales_user,
        sale,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse("sale-confirm", kwargs={"pk": sale.pk}),
            {},
            format="json",
        )

        assert response.status_code == 400

    def test_fulfill_requires_sale_item(
        self,
        api_client,
        inventory_user,
        sale,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.post(
            reverse("sale-fulfill", kwargs={"pk": sale.pk}),
            {"quantity": 1},
            format="json",
        )

        assert response.status_code == 400
        assert "sale_item" in response.data

    def test_fulfill_requires_quantity(
        self,
        api_client,
        inventory_user,
        sale,
        sale_item,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.post(
            reverse("sale-fulfill", kwargs={"pk": sale.pk}),
            {"sale_item": str(sale_item.pk)},
            format="json",
        )

        assert response.status_code == 400
        assert "quantity" in response.data

    def test_fulfill_rejects_non_integer_quantity(
        self,
        api_client,
        inventory_user,
        sale,
        sale_item,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.post(
            reverse("sale-fulfill", kwargs={"pk": sale.pk}),
            {
                "sale_item": str(sale_item.pk),
                "quantity": "abc",
            },
            format="json",
        )

        assert response.status_code == 400

    def test_fulfill_rejects_item_from_another_sale(
        self,
        api_client,
        inventory_user,
        sale,
        sale_item,
        customer,
        warehouse,
        sales_user,
    ):
        another_sale = Sale.objects.create(
            sale_number="SALE-OTHER-VIEW-001",
            customer=customer,
            warehouse=warehouse,
            sale_date=timezone.localdate(),
            created_by=sales_user,
        )

        another_item = SaleItem.objects.create(
            sale=another_sale,
            product_variant=sale_item.product_variant,
            product_name=sale_item.product_name,
            variant_name=sale_item.variant_name,
            sku=sale_item.sku,
            quantity=Decimal("2.000"),
            unit_price=Decimal("50000.00"),
        )

        api_client.force_authenticate(user=inventory_user)

        response = api_client.post(
            reverse("sale-fulfill", kwargs={"pk": sale.pk}),
            {
                "sale_item": str(another_item.pk),
                "quantity": 1,
            },
            format="json",
        )

        assert response.status_code == 400
        assert "sale_item" in response.data

    def test_accountant_cannot_create_sale(
        self,
        api_client,
        accountant_user,
        customer,
        warehouse,
        product_variant,
    ):
        api_client.force_authenticate(user=accountant_user)

        response = api_client.post(
            reverse("sale-list"),
            {
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "items": [
                    {
                        "product_variant": str(product_variant.pk),
                        "quantity": 1,
                    }
                ],
            },
            format="json",
        )

        assert response.status_code == 403


@pytest.mark.django_db
class TestSalesReturnViews:

    def test_sales_user_can_list_returns(
        self,
        api_client,
        sales_user,
        sales_return,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.get(
            reverse("sales-return-list")
        )

        assert response.status_code == 200

    def test_sales_user_can_retrieve_return(
        self,
        api_client,
        sales_user,
        sales_return,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.get(
            reverse(
                "sales-return-detail",
                kwargs={"pk": sales_return.pk},
            )
        )

        assert response.status_code == 200
        assert response.data["return_number"] == sales_return.return_number

    def test_sales_user_can_create_return(
        self,
        api_client,
        sales_user,
        sale,
        sale_item,
    ):
        sale_item.quantity_fulfilled = Decimal("5.000")
        sale_item.save(update_fields=["quantity_fulfilled"])

        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse("sales-return-list"),
            {
                "sale": str(sale.pk),
                "reason": "Customer returned damaged paint",
                "items": [
                    {
                        "sale_item": str(sale_item.pk),
                        "quantity": 2,
                        "condition_notes": "Damaged container",
                    }
                ],
            },
            format="json",
        )

        assert response.status_code == 201

        created_return = SalesReturn.objects.get(
            return_number=response.data["return_number"]
        )

        assert created_return.requested_by == sales_user
        assert created_return.items.count() == 1

    def test_create_return_rejects_empty_items(
        self,
        api_client,
        sales_user,
        sale,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse("sales-return-list"),
            {
                "sale": str(sale.pk),
                "reason": "Return request",
                "items": [],
            },
            format="json",
        )

        assert response.status_code == 400

    def test_manager_can_approve_draft_return(
        self,
        api_client,
        manager_user,
        sales_return,
    ):
        api_client.force_authenticate(user=manager_user)

        response = api_client.post(
            reverse(
                "sales-return-approve",
                kwargs={"pk": sales_return.pk},
            ),
            {},
            format="json",
        )

        assert response.status_code == 200

        sales_return.refresh_from_db()
        assert sales_return.status == SalesReturn.Status.APPROVED
        assert sales_return.approved_by == manager_user

    def test_inventory_user_cannot_approve_return(
        self,
        api_client,
        inventory_user,
        sales_return,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.post(
            reverse(
                "sales-return-approve",
                kwargs={"pk": sales_return.pk},
            ),
            {},
            format="json",
        )

        assert response.status_code == 403

    def test_manager_can_reject_draft_return(
        self,
        api_client,
        manager_user,
        sales_return,
    ):
        api_client.force_authenticate(user=manager_user)

        response = api_client.post(
            reverse(
                "sales-return-reject",
                kwargs={"pk": sales_return.pk},
            ),
            {},
            format="json",
        )

        assert response.status_code == 200

        sales_return.refresh_from_db()
        assert sales_return.status == SalesReturn.Status.REJECTED

    def test_cannot_approve_non_draft_return(
        self,
        api_client,
        manager_user,
        sales_return,
    ):
        sales_return.status = SalesReturn.Status.REJECTED
        sales_return.save(update_fields=["status"])

        api_client.force_authenticate(user=manager_user)

        response = api_client.post(
            reverse(
                "sales-return-approve",
                kwargs={"pk": sales_return.pk},
            ),
            {},
            format="json",
        )

        assert response.status_code == 400