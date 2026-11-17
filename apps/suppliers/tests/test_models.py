from decimal import Decimal

import pytest
from django.db import IntegrityError, transaction
from django.db.models import ProtectedError

from apps.accounts.models import User
from apps.catalog.models import Category, Product, ProductVariant

from apps.suppliers.models import (
    Supplier,
    SupplierContact,
    SupplierProduct,
)


@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="supplier-model@example.com",
        password="TestPassword123!",
        first_name="Supplier",
        last_name="Officer",
        role="procurement_officer",
    )


@pytest.fixture
def supplier(db, user):
    return Supplier.objects.create(
        supplier_number="SUP-TEST-001",
        name="Kigali Paint Suppliers",
        contact_person="John Doe",
        email="supplier@example.com",
        phone_number="+250788000001",
        country="Rwanda",
        status=Supplier.Status.ACTIVE,
        created_by=user,
    )


@pytest.fixture
def product_variant(db):
    category = Category.objects.create(
        name="Supplier Test Paint",
        slug="supplier-test-paint",
    )

    product = Product.objects.create(
        name="Interior Paint",
        slug="supplier-interior-paint",
        product_code="SUP-PNT-001",
        category=category,
        status=Product.Status.ACTIVE,
    )

    return ProductVariant.objects.create(
        product=product,
        name="20 Litre White",
        sku="SUP-PNT-001-20L",
        selling_price=Decimal("25000.00"),
        cost_price=Decimal("15000.00"),
        is_active=True,
    )


@pytest.fixture
def supplier_contact(db, supplier):
    return SupplierContact.objects.create(
        supplier=supplier,
        full_name="Jane Doe",
        job_title="Sales Representative",
        email="jane@example.com",
        phone_number="+250788000002",
        is_primary=True,
    )


@pytest.fixture
def supplier_product(db, supplier, product_variant):
    return SupplierProduct.objects.create(
        supplier=supplier,
        product_variant=product_variant,
        supplier_product_code="SUP-PROD-001",
        last_purchase_price=Decimal("15000.00"),
        currency="RWF",
        minimum_order_quantity=Decimal("2.000"),
        lead_time_days=5,
        is_preferred=True,
        is_active=True,
    )


@pytest.mark.django_db
class TestSupplierModel:

    def test_create_supplier(self, supplier, user):
        assert supplier.pk is not None
        assert supplier.supplier_number == "SUP-TEST-001"
        assert supplier.name == "Kigali Paint Suppliers"
        assert supplier.created_by == user

    def test_supplier_default_values(self, db):
        new_supplier = Supplier.objects.create(
            supplier_number="SUP-DEFAULT-001",
            name="Default Supplier",
            phone_number="+250788000003",
        )

        assert new_supplier.supplier_type == Supplier.SupplierType.COMPANY
        assert new_supplier.status == Supplier.Status.PENDING
        assert new_supplier.country == "Rwanda"
        assert new_supplier.payment_terms_days == 0
        assert new_supplier.created_by is None

    def test_supplier_string_representation(self, supplier):
        assert str(supplier) == (
            "Kigali Paint Suppliers (SUP-TEST-001)"
        )

    def test_supplier_number_must_be_unique(
        self,
        supplier,
    ):
        with pytest.raises(IntegrityError):
            with transaction.atomic():
                Supplier.objects.create(
                    supplier_number=supplier.supplier_number,
                    name="Another Supplier",
                    phone_number="+250788000004",
                )

    def test_supplier_ordering_by_name(self, db):
        Supplier.objects.create(
            supplier_number="SUP-Z-001",
            name="Zebra Suppliers",
            phone_number="+250788000005",
        )

        Supplier.objects.create(
            supplier_number="SUP-A-001",
            name="Alpha Suppliers",
            phone_number="+250788000006",
        )

        suppliers = list(Supplier.objects.all())

        assert suppliers[0].name == "Alpha Suppliers"
        assert suppliers[1].name == "Zebra Suppliers"

    def test_supplier_can_be_created_without_user(self, db):
        new_supplier = Supplier.objects.create(
            supplier_number="SUP-NO-USER-001",
            name="Independent Supplier",
            phone_number="+250788000007",
        )

        assert new_supplier.created_by is None


@pytest.mark.django_db
class TestSupplierContactModel:

    def test_create_supplier_contact(
        self,
        supplier_contact,
        supplier,
    ):
        assert supplier_contact.pk is not None
        assert supplier_contact.supplier == supplier
        assert supplier_contact.full_name == "Jane Doe"
        assert supplier_contact.phone_number == "+250788000002"

    def test_supplier_contact_default_is_not_primary(
        self,
        supplier,
    ):
        contact = SupplierContact.objects.create(
            supplier=supplier,
            full_name="Peter Doe",
            phone_number="+250788000008",
        )

        assert contact.is_primary is False

    def test_supplier_contact_string_representation(
        self,
        supplier_contact,
    ):
        assert str(supplier_contact) == (
            "Jane Doe - Kigali Paint Suppliers"
        )

    def test_supplier_contact_ordering(
        self,
        supplier,
    ):
        SupplierContact.objects.create(
            supplier=supplier,
            full_name="Zack Contact",
            phone_number="+250788000009",
            is_primary=False,
        )

        SupplierContact.objects.create(
            supplier=supplier,
            full_name="Primary Contact",
            phone_number="+250788000010",
            is_primary=True,
        )

        contacts = list(supplier.contacts.all())

        assert contacts[0].full_name == "Primary Contact"

    def test_deleting_supplier_deletes_contacts(
        self,
        supplier,
        supplier_contact,
    ):
        supplier.delete()

        assert SupplierContact.objects.count() == 0


@pytest.mark.django_db
class TestSupplierProductModel:

    def test_create_supplier_product(
        self,
        supplier_product,
        supplier,
        product_variant,
    ):
        assert supplier_product.pk is not None
        assert supplier_product.supplier == supplier
        assert supplier_product.product_variant == product_variant
        assert supplier_product.last_purchase_price == Decimal("15000.00")

    def test_supplier_product_default_values(
        self,
        supplier,
        product_variant,
    ):
        supplier_product = SupplierProduct.objects.create(
            supplier=supplier,
            product_variant=product_variant,
        )

        assert supplier_product.last_purchase_price == Decimal("0")
        assert supplier_product.currency == "RWF"
        assert supplier_product.minimum_order_quantity == Decimal("1")
        assert supplier_product.lead_time_days == 0
        assert supplier_product.is_preferred is False
        assert supplier_product.is_active is True

    def test_supplier_product_string_representation(
        self,
        supplier_product,
    ):
        assert str(supplier_product) == (
            "Kigali Paint Suppliers - SUP-PNT-001-20L"
        )

    def test_supplier_cannot_register_same_variant_twice(
        self,
        supplier,
        product_variant,
        supplier_product,
    ):
        with pytest.raises(IntegrityError):
            with transaction.atomic():
                SupplierProduct.objects.create(
                    supplier=supplier,
                    product_variant=product_variant,
                )

    def test_product_variant_is_protected(
        self,
        supplier_product,
        product_variant,
    ):
        with pytest.raises(ProtectedError):
            product_variant.delete()

    def test_deleting_supplier_deletes_supplier_products(
        self,
        supplier,
        supplier_product,
    ):
        supplier.delete()

        assert SupplierProduct.objects.count() == 0

    def test_supplier_can_register_different_variants(
        self,
        supplier,
        product_variant,
    ):
        category = product_variant.product.category

        another_product = Product.objects.create(
            name="Exterior Paint",
            slug="supplier-exterior-paint",
            product_code="SUP-PNT-002",
            category=category,
            status=Product.Status.ACTIVE,
        )

        another_variant = ProductVariant.objects.create(
            product=another_product,
            name="10 Litre White",
            sku="SUP-PNT-002-10L",
            selling_price=Decimal("18000.00"),
            is_active=True,
        )

        first = SupplierProduct.objects.create(
            supplier=supplier,
            product_variant=product_variant,
        )

        second = SupplierProduct.objects.create(
            supplier=supplier,
            product_variant=another_variant,
        )

        assert first.pk != second.pk
        assert supplier.products.count() == 2