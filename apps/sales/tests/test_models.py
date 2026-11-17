from decimal import Decimal

import pytest
from django.db.models import ProtectedError
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


@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="sales@example.com",
        password="TestPassword123!",
        first_name="Sales",
        last_name="Officer",
        role="sales_person",
    )


@pytest.fixture
def customer(db):
    return Customer.objects.create(
        customer_number="CUS-TEST-001",
        first_name="John",
        last_name="Doe",
        phone_number="+250788000001",
        status=Customer.Status.ACTIVE,
    )


@pytest.fixture
def warehouse(db):
    return Warehouse.objects.create(
        name="Main Warehouse",
        code="WH-TEST-001",
        status=Warehouse.Status.ACTIVE,
    )


@pytest.fixture
def product_variant(db):
    category = Category.objects.create(
        name="Paint",
        slug="paint",
    )

    product = Product.objects.create(
        name="Interior Paint",
        slug="interior-paint",
        product_code="PNT-TEST-001",
        category=category,
        status=Product.Status.ACTIVE,
    )

    return ProductVariant.objects.create(
        product=product,
        name="20 Litre White",
        sku="PNT-TEST-001-20L",
        selling_price=Decimal("25000.00"),
        cost_price=Decimal("15000.00"),
        is_active=True,
    )


@pytest.fixture
def quotation(db, customer, warehouse, user):
    return SalesQuotation.objects.create(
        quotation_number="QUO-TEST-001",
        customer=customer,
        warehouse=warehouse,
        quotation_date=timezone.localdate(),
        valid_until=timezone.localdate(),
        created_by=user,
    )


@pytest.fixture
def sale(db, customer, warehouse, user):
    return Sale.objects.create(
        sale_number="SALE-TEST-001",
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
        unit_price=Decimal("25000.00"),
        line_total=Decimal("250000.00"),
        quantity_fulfilled=Decimal("4.000"),
    )


@pytest.fixture
def sales_return(db, sale, user):
    return SalesReturn.objects.create(
        return_number="RET-TEST-001",
        sale=sale,
        reason="Damaged paint container",
        requested_by=user,
    )


@pytest.mark.django_db
class TestSalesQuotationModel:

    def test_create_sales_quotation(self, quotation, customer, warehouse):
        assert quotation.pk is not None
        assert quotation.customer == customer
        assert quotation.warehouse == warehouse
        assert quotation.status == SalesQuotation.Status.DRAFT
        assert quotation.currency == "RWF"

    def test_default_amounts_are_zero(self, quotation):
        assert quotation.subtotal == Decimal("0")
        assert quotation.discount_amount == Decimal("0")
        assert quotation.tax_amount == Decimal("0")
        assert quotation.total_amount == Decimal("0")

    def test_string_representation(self, quotation):
        assert str(quotation) == "QUO-TEST-001"

    def test_quotation_number_must_be_unique(
        self,
        quotation,
        customer,
        warehouse,
        user,
    ):
        with pytest.raises(Exception):
            SalesQuotation.objects.create(
                quotation_number=quotation.quotation_number,
                customer=customer,
                warehouse=warehouse,
                quotation_date=timezone.localdate(),
                created_by=user,
            )

    def test_quotation_item_creation(
        self,
        quotation,
        product_variant,
    ):
        item = SalesQuotationItem.objects.create(
            quotation=quotation,
            product_variant=product_variant,
            quantity=Decimal("2.000"),
            unit_price=Decimal("25000.00"),
        )

        assert item.quotation == quotation
        assert item.product_variant == product_variant
        assert item.quantity == Decimal("2.000")
        assert item.line_total == Decimal("0")

    def test_deleting_quotation_deletes_its_items(
        self,
        quotation,
        product_variant,
    ):
        SalesQuotationItem.objects.create(
            quotation=quotation,
            product_variant=product_variant,
            quantity=Decimal("2.000"),
            unit_price=Decimal("25000.00"),
        )

        quotation.delete()

        assert SalesQuotationItem.objects.count() == 0

    def test_product_variant_is_protected(
        self,
        quotation,
        product_variant,
    ):
        SalesQuotationItem.objects.create(
            quotation=quotation,
            product_variant=product_variant,
            quantity=Decimal("2.000"),
            unit_price=Decimal("25000.00"),
        )

        with pytest.raises(ProtectedError):
            product_variant.delete()


@pytest.mark.django_db
class TestSaleModel:

    def test_create_sale(self, sale, customer, warehouse):
        assert sale.pk is not None
        assert sale.customer == customer
        assert sale.warehouse == warehouse
        assert sale.status == Sale.Status.DRAFT
        assert sale.sales_channel == Sale.SalesChannel.DIRECT
        assert sale.currency == "RWF"

    def test_default_amounts_are_zero(self, sale):
        assert sale.subtotal == Decimal("0")
        assert sale.discount_amount == Decimal("0")
        assert sale.tax_amount == Decimal("0")
        assert sale.total_amount == Decimal("0")

    def test_string_representation(self, sale):
        assert str(sale) == "SALE-TEST-001"

    def test_sale_number_must_be_unique(
        self,
        sale,
        customer,
        warehouse,
        user,
    ):
        with pytest.raises(Exception):
            Sale.objects.create(
                sale_number=sale.sale_number,
                customer=customer,
                warehouse=warehouse,
                sale_date=timezone.localdate(),
                created_by=user,
            )

    def test_sale_item_creation(self, sale_item, sale):
        assert sale_item.sale == sale
        assert sale_item.quantity == Decimal("10.000")
        assert sale_item.quantity_fulfilled == Decimal("4.000")

    def test_sale_item_quantity_outstanding(self, sale_item):
        assert sale_item.quantity_outstanding == Decimal("6.000")

    def test_sale_item_string_representation(self, sale_item):
        assert str(sale_item) == (
            f"{sale_item.sale.sale_number} - {sale_item.sku}"
        )

    def test_deleting_sale_deletes_its_items(self, sale, sale_item):
        sale.delete()

        assert SaleItem.objects.count() == 0

    def test_sale_item_protects_product_variant(
        self,
        sale_item,
        product_variant,
    ):
        with pytest.raises(ProtectedError):
            product_variant.delete()

    def test_quotation_can_be_linked_to_sale(
        self,
        customer,
        warehouse,
        user,
        quotation,
    ):
        sale_with_quotation = Sale.objects.create(
            sale_number="SALE-WITH-QUO-001",
            customer=customer,
            warehouse=warehouse,
            quotation=quotation,
            sale_date=timezone.localdate(),
            created_by=user,
        )

        assert sale_with_quotation.quotation == quotation
        assert quotation.converted_sale == sale_with_quotation

    def test_deleting_quotation_does_not_delete_sale(
        self,
        sale,
        quotation,
    ):
        sale.quotation = quotation
        sale.save(update_fields=["quotation"])

        quotation.delete()

        sale.refresh_from_db()
        assert sale.quotation is None


@pytest.mark.django_db
class TestSalesReturnModel:

    def test_create_sales_return(self, sales_return, sale, user):
        assert sales_return.pk is not None
        assert sales_return.sale == sale
        assert sales_return.requested_by == user
        assert sales_return.status == SalesReturn.Status.DRAFT

    def test_string_representation(self, sales_return):
        assert str(sales_return) == "RET-TEST-001"

    def test_sales_return_item_creation(
        self,
        sales_return,
        sale_item,
    ):
        item = SalesReturnItem.objects.create(
            sales_return=sales_return,
            sale_item=sale_item,
            quantity=Decimal("2.000"),
            unit_refund_amount=Decimal("25000.00"),
        )

        assert item.sales_return == sales_return
        assert item.sale_item == sale_item
        assert item.quantity == Decimal("2.000")

    def test_deleting_return_deletes_its_items(
        self,
        sales_return,
        sale_item,
    ):
        SalesReturnItem.objects.create(
            sales_return=sales_return,
            sale_item=sale_item,
            quantity=Decimal("2.000"),
            unit_refund_amount=Decimal("25000.00"),
        )

        sales_return.delete()

        assert SalesReturnItem.objects.count() == 0

    def test_sale_is_protected_when_return_exists(
        self,
        sales_return,
        sale,
    ):
        with pytest.raises(ProtectedError):
            sale.delete()

    def test_sale_item_is_protected_when_return_item_exists(
        self,
        sales_return,
        sale_item,
    ):
        SalesReturnItem.objects.create(
            sales_return=sales_return,
            sale_item=sale_item,
            quantity=Decimal("2.000"),
            unit_refund_amount=Decimal("25000.00"),
        )

        with pytest.raises(ProtectedError):
            sale_item.delete()