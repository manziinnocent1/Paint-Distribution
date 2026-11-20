from decimal import Decimal

import pytest

from apps.accounts.models import User
from apps.catalog.models import Category, Product, ProductVariant

from apps.suppliers.models import (
    Supplier,
    SupplierContact,
    SupplierProduct,
)

from apps.suppliers.serializers import (
    SupplierSerializer,
    SupplierContactSerializer,
    SupplierProductSerializer,
)


@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="supplier-serializer@example.com",
        password="TestPassword123!",
        first_name="Serializer",
        last_name="User",
        role="procurement_officer",
    )


@pytest.fixture
def supplier(db, user):
    return Supplier.objects.create(
        supplier_number="SUP-SER-001",
        name="Serializer Paint Suppliers",
        contact_person="John Doe",
        email="serializer@example.com",
        phone_number="+250788000011",
        status=Supplier.Status.ACTIVE,
        created_by=user,
    )


@pytest.fixture
def another_supplier(db):
    return Supplier.objects.create(
        supplier_number="SUP-SER-002",
        name="Another Paint Supplier",
        phone_number="+250788000012",
        status=Supplier.Status.ACTIVE,
    )


@pytest.fixture
def product_variant(db):
    category = Category.objects.create(
        name="Serializer Test Paint",
        slug="serializer-test-paint",
    )

    product = Product.objects.create(
        name="Premium Paint",
        slug="serializer-premium-paint",
        product_code="SER-PNT-001",
        category=category,
        status=Product.Status.ACTIVE,
    )

    return ProductVariant.objects.create(
        product=product,
        name="20 Litre Premium White",
        sku="SER-PNT-001-20L",
        selling_price=Decimal("30000.00"),
        cost_price=Decimal("18000.00"),
        is_active=True,
    )


@pytest.fixture
def supplier_contact(db, supplier):
    return SupplierContact.objects.create(
        supplier=supplier,
        full_name="Jane Doe",
        job_title="Procurement Contact",
        email="jane.serializer@example.com",
        phone_number="+250788000013",
        is_primary=True,
    )


@pytest.fixture
def supplier_product(db, supplier, product_variant):
    return SupplierProduct.objects.create(
        supplier=supplier,
        product_variant=product_variant,
        supplier_product_code="SER-SUP-PROD-001",
        last_purchase_price=Decimal("18000.00"),
        minimum_order_quantity=Decimal("2.000"),
        lead_time_days=7,
        is_preferred=True,
    )


@pytest.mark.django_db
class TestSupplierContactSerializer:

    def test_serializes_supplier_contact(
        self,
        supplier_contact,
    ):
        data = SupplierContactSerializer(supplier_contact).data

        assert data["full_name"] == "Jane Doe"
        assert data["job_title"] == "Procurement Contact"
        assert data["phone_number"] == "+250788000013"
        assert data["is_primary"] is True

    def test_contact_id_is_read_only(
        self,
        supplier_contact,
    ):
        serializer = SupplierContactSerializer(
            supplier_contact,
            data={"full_name": "Updated Contact"},
            partial=True,
        )

        assert serializer.is_valid(), serializer.errors
        assert "id" not in serializer.validated_data

    def test_created_and_updated_timestamps_are_read_only(
        self,
        supplier_contact,
    ):
        serializer = SupplierContactSerializer(
            supplier_contact,
            data={
                "created_at": "2020-01-01T00:00:00Z",
                "updated_at": "2020-01-01T00:00:00Z",
            },
            partial=True,
        )

        assert serializer.is_valid(), serializer.errors
        assert "created_at" not in serializer.validated_data
        assert "updated_at" not in serializer.validated_data


@pytest.mark.django_db
class TestSupplierProductSerializer:

    def test_serializes_supplier_product(
        self,
        supplier_product,
        product_variant,
    ):
        data = SupplierProductSerializer(supplier_product).data

        assert data["product_name"] == product_variant.product.name
        assert data["variant_name"] == product_variant.name
        assert data["sku"] == product_variant.sku
        assert data["currency"] == "RWF"
        assert data["is_preferred"] is True

    def test_valid_supplier_product(
        self,
        supplier,
        product_variant,
    ):
        serializer = SupplierProductSerializer(
            data={
                "supplier": str(supplier.pk),
                "product_variant": str(product_variant.pk),
                "supplier_product_code": "NEW-CODE-001",
                "last_purchase_price": "18000.00",
                "currency": "RWF",
                "minimum_order_quantity": "2.000",
                "lead_time_days": 5,
                "is_preferred": True,
                "is_active": True,
            }
        )

        assert serializer.is_valid(), serializer.errors

    def test_rejects_duplicate_supplier_product(
        self,
        supplier,
        product_variant,
        supplier_product,
    ):
        serializer = SupplierProductSerializer(
            data={
                "supplier": str(supplier.pk),
                "product_variant": str(product_variant.pk),
            }
        )

        assert not serializer.is_valid()
        assert "non_field_errors" in serializer.errors

    def test_allows_same_variant_for_different_supplier(
        self,
        another_supplier,
        product_variant,
        supplier_product,
    ):
        serializer = SupplierProductSerializer(
            data={
                "supplier": str(another_supplier.pk),
                "product_variant": str(product_variant.pk),
            }
        )

        assert serializer.is_valid(), serializer.errors

    def test_product_can_be_updated_without_duplicate_error(
        self,
        supplier_product,
    ):
        serializer = SupplierProductSerializer(
            supplier_product,
            data={
                "supplier": str(supplier_product.supplier_id),
                "product_variant": str(
                    supplier_product.product_variant_id
                ),
                "supplier_product_code": "UPDATED-CODE",
            },
            partial=True,
        )

        assert serializer.is_valid(), serializer.errors

    def test_rejects_duplicate_when_changing_to_existing_pair(
        self,
        supplier,
        product_variant,
        supplier_product,
    ):
        category = product_variant.product.category

        another_product = Product.objects.create(
            name="Another Product",
            slug="serializer-another-product",
            product_code="SER-PNT-002",
            category=category,
            status=Product.Status.ACTIVE,
        )

        another_variant = ProductVariant.objects.create(
            product=another_product,
            name="Another Variant",
            sku="SER-PNT-002-V1",
            selling_price=Decimal("20000.00"),
        )

        second_supplier_product = SupplierProduct.objects.create(
            supplier=supplier,
            product_variant=another_variant,
        )

        serializer = SupplierProductSerializer(
            second_supplier_product,
            data={
                "product_variant": str(product_variant.pk),
            },
            partial=True,
        )

        assert not serializer.is_valid()
        assert "non_field_errors" in serializer.errors

    def test_supplier_product_id_is_read_only(
        self,
        supplier_product,
    ):
        serializer = SupplierProductSerializer(
            supplier_product,
            data={"supplier_product_code": "UPDATED"},
            partial=True,
        )

        assert serializer.is_valid(), serializer.errors
        assert "id" not in serializer.validated_data


@pytest.mark.django_db
class TestSupplierSerializer:

    def test_serializes_supplier(self, supplier):
        data = SupplierSerializer(supplier).data

        assert data["supplier_number"] == "SUP-SER-001"
        assert data["name"] == "Serializer Paint Suppliers"
        assert data["status"] == Supplier.Status.ACTIVE
        assert data["created_by_name"] == supplier.created_by.get_full_name()

    def test_serializes_supplier_without_created_by(self, db):
        supplier = Supplier.objects.create(
            supplier_number="SUP-NO-CREATOR",
            name="Supplier Without Creator",
            phone_number="+250788000014",
        )

        data = SupplierSerializer(supplier).data

        assert data["created_by_name"] is None

    def test_nested_contacts_and_products(
        self,
        supplier,
        supplier_contact,
        supplier_product,
    ):
        data = SupplierSerializer(supplier).data

        assert len(data["contacts"]) == 1
        assert data["contacts"][0]["full_name"] == "Jane Doe"

        assert len(data["products"]) == 1
        assert (
            data["products"][0]["sku"]
            == supplier_product.product_variant.sku
        )

    def test_supplier_number_is_read_only(self, supplier):
        serializer = SupplierSerializer(
            supplier,
            data={"supplier_number": "CHANGED"},
            partial=True,
        )

        assert serializer.is_valid(), serializer.errors
        assert "supplier_number" not in serializer.validated_data

    def test_created_by_is_read_only(self, supplier, user):
        serializer = SupplierSerializer(
            supplier,
            data={"created_by": str(user.pk)},
            partial=True,
        )

        assert serializer.is_valid(), serializer.errors
        assert "created_by" not in serializer.validated_data

    def test_payment_terms_can_be_zero(self):
        serializer = SupplierSerializer(
            data={
                "supplier_number": "SUP-VALIDATION-001",
                "name": "Payment Terms Supplier",
                "phone_number": "+250788000015",
                "payment_terms_days": 0,
            }
        )

        assert serializer.is_valid(), serializer.errors

    def test_payment_terms_accept_positive_value(self):
        serializer = SupplierSerializer(
            data={
                "supplier_number": "SUP-VALIDATION-002",
                "name": "Payment Terms Supplier Two",
                "phone_number": "+250788000016",
                "payment_terms_days": 30,
            }
        )

        assert serializer.is_valid(), serializer.errors

    def test_rejects_negative_payment_terms(self):
        serializer = SupplierSerializer(
            data={
                "supplier_number": "SUP-VALIDATION-003",
                "name": "Invalid Payment Terms Supplier",
                "phone_number": "+250788000017",
                "payment_terms_days": -5,
            }
        )

        assert not serializer.is_valid()
        assert "payment_terms_days" in serializer.errors