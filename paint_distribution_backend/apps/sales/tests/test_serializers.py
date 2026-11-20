from decimal import Decimal
from types import SimpleNamespace

import pytest
from django.utils import timezone

from apps.accounts.models import User
from apps.catalog.models import Category, Product, ProductVariant
from apps.customers.models import Customer
from apps.inventory.models import Warehouse

from apps.sales.models import (
    SalesQuotation,
    SalesQuotationItem,
    Sale,
    SaleItem,
    SalesReturn,
    SalesReturnItem,
)

from apps.sales.serializers import (
    SalesQuotationItemSerializer,
    SalesQuotationSerializer,
    SalesQuotationItemCreateSerializer,
    SalesQuotationCreateSerializer,
    SaleItemSerializer,
    SaleSerializer,
    SaleItemCreateSerializer,
    SaleCreateSerializer,
    SalesReturnItemSerializer,
    SalesReturnSerializer,
    SalesReturnItemCreateSerializer,
    SalesReturnCreateSerializer,
)


@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="serializer@example.com",
        password="TestPassword123!",
        first_name="Test",
        last_name="Sales",
        role="sales_person",
    )


@pytest.fixture
def customer(db):
    return Customer.objects.create(
        customer_number="CUS-SER-001",
        first_name="Jane",
        last_name="Doe",
        phone_number="+250788000002",
        status=Customer.Status.ACTIVE,
    )


@pytest.fixture
def inactive_customer(db):
    return Customer.objects.create(
        customer_number="CUS-SER-002",
        first_name="Inactive",
        last_name="Customer",
        phone_number="+250788000003",
        status=Customer.Status.INACTIVE,
    )


@pytest.fixture
def warehouse(db):
    return Warehouse.objects.create(
        name="Serializer Warehouse",
        code="WH-SER-001",
        status=Warehouse.Status.ACTIVE,
    )


@pytest.fixture
def inactive_warehouse(db):
    return Warehouse.objects.create(
        name="Inactive Warehouse",
        code="WH-SER-002",
        status=Warehouse.Status.INACTIVE,
    )


@pytest.fixture
def product_variant(db):
    category = Category.objects.create(
        name="Serializer Paint",
        slug="serializer-paint",
    )

    product = Product.objects.create(
        name="Exterior Paint",
        slug="exterior-paint",
        product_code="EXT-SER-001",
        category=category,
        status=Product.Status.ACTIVE,
        tax_rate=Decimal("18.00"),
    )

    return ProductVariant.objects.create(
        product=product,
        name="10 Litre White",
        sku="EXT-SER-001-10L",
        selling_price=Decimal("30000.00"),
        cost_price=Decimal("18000.00"),
        is_active=True,
    )


@pytest.fixture
def inactive_variant(db):
    category = Category.objects.create(
        name="Inactive Paint",
        slug="inactive-paint",
    )

    product = Product.objects.create(
        name="Inactive Product",
        slug="inactive-product",
        product_code="INACTIVE-001",
        category=category,
        status=Product.Status.ACTIVE,
    )

    return ProductVariant.objects.create(
        product=product,
        name="Inactive Variant",
        sku="INACTIVE-001-V1",
        selling_price=Decimal("10000.00"),
        is_active=False,
    )


@pytest.fixture
def quotation(db, customer, warehouse, user):
    return SalesQuotation.objects.create(
        quotation_number="QUO-SER-001",
        customer=customer,
        warehouse=warehouse,
        quotation_date=timezone.localdate(),
        valid_until=timezone.localdate(),
        created_by=user,
    )


@pytest.fixture
def sale(db, customer, warehouse, user):
    return Sale.objects.create(
        sale_number="SALE-SER-001",
        customer=customer,
        warehouse=warehouse,
        sale_date=timezone.localdate(),
        created_by=user,
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
        unit_price=Decimal("30000.00"),
        quantity_fulfilled=Decimal("5.000"),
    )


@pytest.fixture
def sales_return(db, sale, user):
    return SalesReturn.objects.create(
        return_number="RET-SER-001",
        sale=sale,
        reason="Damaged product",
        requested_by=user,
    )


@pytest.mark.django_db
class TestSalesQuotationItemSerializer:

    def test_serializes_quotation_item(
        self,
        quotation,
        product_variant,
    ):
        item = SalesQuotationItem.objects.create(
            quotation=quotation,
            product_variant=product_variant,
            quantity=Decimal("2.000"),
            unit_price=Decimal("30000.00"),
        )

        data = SalesQuotationItemSerializer(item).data

        assert data["product_name"] == product_variant.product.name
        assert data["variant_name"] == product_variant.name
        assert data["sku"] == product_variant.sku
        assert data["quantity"] == "2.000"

    def test_line_total_is_read_only(self, quotation, product_variant):
        item = SalesQuotationItem.objects.create(
            quotation=quotation,
            product_variant=product_variant,
            quantity=Decimal("2.000"),
            unit_price=Decimal("30000.00"),
            line_total=Decimal("60000.00"),
        )

        serializer = SalesQuotationItemSerializer(
            item,
            data={"line_total": "1.00"},
            partial=True,
        )

        assert serializer.is_valid()
        assert "line_total" not in serializer.validated_data


@pytest.mark.django_db
class TestSalesQuotationSerializer:

    def test_serializes_quotation(self, quotation):
        data = SalesQuotationSerializer(quotation).data

        assert data["quotation_number"] == quotation.quotation_number
        assert data["customer_name"] == str(quotation.customer)
        assert data["warehouse_name"] == quotation.warehouse.name
        assert data["status"] == SalesQuotation.Status.DRAFT

    def test_quotation_number_is_read_only(self, quotation):
        serializer = SalesQuotationSerializer(
            quotation,
            data={"quotation_number": "CHANGED"},
            partial=True,
        )

        assert serializer.is_valid()
        assert "quotation_number" not in serializer.validated_data


@pytest.mark.django_db
class TestSalesQuotationItemCreateSerializer:

    def test_valid_item(self, product_variant):
        serializer = SalesQuotationItemCreateSerializer(
            data={
                "product_variant": str(product_variant.pk),
                "quantity": 2,
                "discount_amount": "1000.00",
            }
        )

        assert serializer.is_valid(), serializer.errors

    def test_quantity_must_be_positive(self, product_variant):
        serializer = SalesQuotationItemCreateSerializer(
            data={
                "product_variant": str(product_variant.pk),
                "quantity": 0,
            }
        )

        assert not serializer.is_valid()
        assert "quantity" in serializer.errors

    def test_inactive_variant_is_rejected(self, inactive_variant):
        serializer = SalesQuotationItemCreateSerializer(
            data={
                "product_variant": str(inactive_variant.pk),
                "quantity": 2,
            }
        )

        assert not serializer.is_valid()
        assert "product_variant" in serializer.errors


@pytest.mark.django_db
class TestSalesQuotationCreateSerializer:

    def test_valid_quotation(
        self,
        customer,
        warehouse,
        product_variant,
    ):
        serializer = SalesQuotationCreateSerializer(
            data={
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "quotation_date": str(timezone.localdate()),
                "valid_until": str(timezone.localdate()),
                "items": [
                    {
                        "product_variant": str(product_variant.pk),
                        "quantity": 2,
                        "discount_amount": "1000.00",
                    }
                ],
            }
        )

        assert serializer.is_valid(), serializer.errors

    def test_rejects_inactive_customer(
        self,
        inactive_customer,
        warehouse,
        product_variant,
    ):
        serializer = SalesQuotationCreateSerializer(
            data={
                "customer": str(inactive_customer.pk),
                "warehouse": str(warehouse.pk),
                "valid_until": str(timezone.localdate()),
                "items": [
                    {
                        "product_variant": str(product_variant.pk),
                        "quantity": 1,
                    }
                ],
            }
        )

        assert not serializer.is_valid()
        assert "customer" in serializer.errors

    def test_rejects_inactive_warehouse(
        self,
        customer,
        inactive_warehouse,
        product_variant,
    ):
        serializer = SalesQuotationCreateSerializer(
            data={
                "customer": str(customer.pk),
                "warehouse": str(inactive_warehouse.pk),
                "valid_until": str(timezone.localdate()),
                "items": [
                    {
                        "product_variant": str(product_variant.pk),
                        "quantity": 1,
                    }
                ],
            }
        )

        assert not serializer.is_valid()
        assert "warehouse" in serializer.errors

    def test_valid_until_cannot_be_before_quotation_date(
        self,
        customer,
        warehouse,
        product_variant,
    ):
        today = timezone.localdate()

        serializer = SalesQuotationCreateSerializer(
            data={
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "quotation_date": str(today),
                "valid_until": str(today - timezone.timedelta(days=1)),
                "items": [
                    {
                        "product_variant": str(product_variant.pk),
                        "quantity": 1,
                    }
                ],
            }
        )

        assert not serializer.is_valid()
        assert "valid_until" in serializer.errors

    def test_requires_at_least_one_item(self, customer, warehouse):
        serializer = SalesQuotationCreateSerializer(
            data={
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "valid_until": str(timezone.localdate()),
                "items": [],
            }
        )

        assert not serializer.is_valid()
        assert "items" in serializer.errors

    def test_creates_quotation_and_calculates_totals(
        self,
        user,
        customer,
        warehouse,
        product_variant,
    ):
        request = SimpleNamespace(user=user)

        serializer = SalesQuotationCreateSerializer(
            data={
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "quotation_date": str(timezone.localdate()),
                "valid_until": str(timezone.localdate()),
                "items": [
                    {
                        "product_variant": str(product_variant.pk),
                        "quantity": 2,
                        "discount_amount": "1000.00",
                    }
                ],
            },
            context={"request": request},
        )

        assert serializer.is_valid(), serializer.errors

        quotation = serializer.save(
            quotation_number="QUO-SER-CREATED-001",
        )

        assert quotation.created_by == user
        assert quotation.items.count() == 1
        assert quotation.subtotal == Decimal("60000.00")
        assert quotation.discount_amount == Decimal("1000.00")
        assert quotation.tax_amount == Decimal("10620.00")
        assert quotation.total_amount == Decimal("69620.00")


@pytest.mark.django_db
class TestSaleItemSerializer:

    def test_serializes_sale_item(self, sale_item):
        data = SaleItemSerializer(sale_item).data

        assert data["product_name"] == sale_item.product_name
        assert data["variant_name"] == sale_item.variant_name
        assert data["sku"] == sale_item.sku
        assert data["quantity"] == "10.000"

    def test_read_only_fields_are_not_updated(self, sale_item):
        serializer = SaleItemSerializer(
            sale_item,
            data={
                "quantity": "2.000",
                "unit_price": "1.00",
                "product_name": "Changed Name",
            },
            partial=True,
        )

        assert serializer.is_valid()
        assert "unit_price" not in serializer.validated_data
        assert "product_name" not in serializer.validated_data


@pytest.mark.django_db
class TestSaleSerializer:

    def test_serializes_sale(self, sale):
        data = SaleSerializer(sale).data

        assert data["sale_number"] == sale.sale_number
        assert data["customer_name"] == str(sale.customer)
        assert data["warehouse_name"] == sale.warehouse.name
        assert data["status"] == Sale.Status.DRAFT

    def test_sale_number_is_read_only(self, sale):
        serializer = SaleSerializer(
            sale,
            data={"sale_number": "CHANGED"},
            partial=True,
        )

        assert serializer.is_valid()
        assert "sale_number" not in serializer.validated_data


@pytest.mark.django_db
class TestSaleItemCreateSerializer:

    def test_valid_sale_item(self, product_variant):
        serializer = SaleItemCreateSerializer(
            data={
                "product_variant": str(product_variant.pk),
                "quantity": 2,
                "discount_amount": "1000.00",
            }
        )

        assert serializer.is_valid(), serializer.errors

    def test_rejects_zero_quantity(self, product_variant):
        serializer = SaleItemCreateSerializer(
            data={
                "product_variant": str(product_variant.pk),
                "quantity": 0,
            }
        )

        assert not serializer.is_valid()
        assert "quantity" in serializer.errors

    def test_rejects_inactive_variant(self, inactive_variant):
        serializer = SaleItemCreateSerializer(
            data={
                "product_variant": str(inactive_variant.pk),
                "quantity": 1,
            }
        )

        assert not serializer.is_valid()
        assert "product_variant" in serializer.errors


@pytest.mark.django_db
class TestSaleCreateSerializer:

    def test_valid_sale(
        self,
        customer,
        warehouse,
        product_variant,
    ):
        serializer = SaleCreateSerializer(
            data={
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "sales_channel": Sale.SalesChannel.DIRECT,
                "sale_date": str(timezone.localdate()),
                "items": [
                    {
                        "product_variant": str(product_variant.pk),
                        "quantity": 2,
                        "discount_amount": "1000.00",
                    }
                ],
            }
        )

        assert serializer.is_valid(), serializer.errors

    def test_rejects_empty_items(self, customer, warehouse):
        serializer = SaleCreateSerializer(
            data={
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "items": [],
            }
        )

        assert not serializer.is_valid()
        assert "items" in serializer.errors

    def test_rejects_discount_above_gross_value(
        self,
        customer,
        warehouse,
        product_variant,
    ):
        serializer = SaleCreateSerializer(
            data={
                "customer": str(customer.pk),
                "warehouse": str(warehouse.pk),
                "items": [
                    {
                        "product_variant": str(product_variant.pk),
                        "quantity": 1,
                        "discount_amount": "40000.00",
                    }
                ],
            }
        )

        assert not serializer.is_valid()
        assert "items" in serializer.errors


@pytest.mark.django_db
class TestSalesReturnItemSerializer:

    def test_serializes_return_item(
        self,
        sales_return,
        sale_item,
    ):
        item = SalesReturnItem.objects.create(
            sales_return=sales_return,
            sale_item=sale_item,
            quantity=Decimal("1.000"),
            unit_refund_amount=Decimal("30000.00"),
        )

        data = SalesReturnItemSerializer(item).data

        assert data["quantity"] == "1.000"
        assert data["unit_refund_amount"] == "30000.00"


@pytest.mark.django_db
class TestSalesReturnSerializer:

    def test_serializes_sales_return(self, sales_return):
        data = SalesReturnSerializer(sales_return).data

        assert data["return_number"] == sales_return.return_number
        assert data["sale_number"] == sales_return.sale.sale_number
        assert data["reason"] == sales_return.reason


@pytest.mark.django_db
class TestSalesReturnItemCreateSerializer:

    def test_valid_return_item(self, sale_item):
        serializer = SalesReturnItemCreateSerializer(
            data={
                "sale_item": str(sale_item.pk),
                "quantity": 2,
                "condition_notes": "Container damaged",
            }
        )

        assert serializer.is_valid(), serializer.errors

    def test_rejects_zero_quantity(self, sale_item):
        serializer = SalesReturnItemCreateSerializer(
            data={
                "sale_item": str(sale_item.pk),
                "quantity": 0,
            }
        )

        assert not serializer.is_valid()
        assert "quantity" in serializer.errors


@pytest.mark.django_db
class TestSalesReturnCreateSerializer:

    def test_valid_return(self, sale, sale_item):
        serializer = SalesReturnCreateSerializer(
            data={
                "sale": str(sale.pk),
                "reason": "Customer returned damaged paint",
                "items": [
                    {
                        "sale_item": str(sale_item.pk),
                        "quantity": 2,
                    }
                ],
            }
        )

        assert serializer.is_valid(), serializer.errors

    def test_rejects_cancelled_sale(self, sale, sale_item):
        sale.status = Sale.Status.CANCELLED
        sale.save(update_fields=["status"])

        serializer = SalesReturnCreateSerializer(
            data={
                "sale": str(sale.pk),
                "reason": "Return request",
                "items": [
                    {
                        "sale_item": str(sale_item.pk),
                        "quantity": 1,
                    }
                ],
            }
        )

        assert not serializer.is_valid()

    def test_rejects_quantity_above_fulfilled_quantity(
        self,
        sale,
        sale_item,
    ):
        serializer = SalesReturnCreateSerializer(
            data={
                "sale": str(sale.pk),
                "reason": "Return request",
                "items": [
                    {
                        "sale_item": str(sale_item.pk),
                        "quantity": 6,
                    }
                ],
            }
        )

        assert not serializer.is_valid()

    def test_rejects_item_from_another_sale(
        self,
        sale,
        sale_item,
        customer,
        warehouse,
        user,
    ):
        another_sale = Sale.objects.create(
            sale_number="SALE-OTHER-001",
            customer=customer,
            warehouse=warehouse,
            sale_date=timezone.localdate(),
            created_by=user,
        )

        another_item = SaleItem.objects.create(
            sale=another_sale,
            product_variant=sale_item.product_variant,
            product_name=sale_item.product_name,
            variant_name=sale_item.variant_name,
            sku=sale_item.sku,
            quantity=Decimal("5.000"),
            unit_price=Decimal("30000.00"),
            quantity_fulfilled=Decimal("5.000"),
        )

        serializer = SalesReturnCreateSerializer(
            data={
                "sale": str(sale.pk),
                "reason": "Return request",
                "items": [
                    {
                        "sale_item": str(another_item.pk),
                        "quantity": 1,
                    }
                ],
            }
        )

        assert not serializer.is_valid()