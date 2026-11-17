from decimal import Decimal

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.catalog.models import Category, Product, ProductVariant

from apps.suppliers.models import (
    Supplier,
    SupplierContact,
    SupplierProduct,
)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def procurement_user(db):
    return User.objects.create_user(
        email="procurement-view@example.com",
        password="TestPassword123!",
        first_name="Procurement",
        last_name="Officer",
        role="procurement_officer",
    )


@pytest.fixture
def manager_user(db):
    return User.objects.create_user(
        email="manager-view@example.com",
        password="TestPassword123!",
        first_name="Business",
        last_name="Manager",
        role="manager",
    )


@pytest.fixture
def inventory_user(db):
    return User.objects.create_user(
        email="inventory-view@example.com",
        password="TestPassword123!",
        first_name="Inventory",
        last_name="Officer",
        role="inventory_manager",
    )


@pytest.fixture
def accountant_user(db):
    return User.objects.create_user(
        email="accountant-view@example.com",
        password="TestPassword123!",
        first_name="Account",
        last_name="Officer",
        role="accountant",
    )


@pytest.fixture
def sales_user(db):
    return User.objects.create_user(
        email="sales-view@example.com",
        password="TestPassword123!",
        first_name="Sales",
        last_name="Officer",
        role="sales_person",
    )


@pytest.fixture
def supplier(db, procurement_user):
    return Supplier.objects.create(
        supplier_number="SUP-VIEW-001",
        name="View Paint Suppliers",
        contact_person="John Doe",
        email="view@example.com",
        phone_number="+250788000020",
        status=Supplier.Status.PENDING,
        created_by=procurement_user,
    )


@pytest.fixture
def supplier_contact(db, supplier):
    return SupplierContact.objects.create(
        supplier=supplier,
        full_name="Jane Contact",
        job_title="Sales Representative",
        email="jane.view@example.com",
        phone_number="+250788000021",
        is_primary=True,
    )


@pytest.fixture
def product_variant(db):
    category = Category.objects.create(
        name="View Supplier Paint",
        slug="view-supplier-paint",
    )

    product = Product.objects.create(
        name="View Interior Paint",
        slug="view-interior-paint",
        product_code="VIEW-PNT-001",
        category=category,
        status=Product.Status.ACTIVE,
    )

    return ProductVariant.objects.create(
        product=product,
        name="20 Litre White",
        sku="VIEW-PNT-001-20L",
        selling_price=Decimal("25000.00"),
        cost_price=Decimal("15000.00"),
        is_active=True,
    )


@pytest.fixture
def supplier_product(db, supplier, product_variant):
    return SupplierProduct.objects.create(
        supplier=supplier,
        product_variant=product_variant,
        supplier_product_code="VIEW-SUP-PROD-001",
        last_purchase_price=Decimal("15000.00"),
        currency="RWF",
        minimum_order_quantity=Decimal("2.000"),
        lead_time_days=5,
        is_preferred=True,
    )


@pytest.mark.django_db
class TestSupplierViews:

    def test_unauthenticated_user_cannot_list_suppliers(
        self,
        api_client,
    ):
        response = api_client.get(
            reverse("supplier-list")
        )

        assert response.status_code in [401, 403]

    def test_procurement_user_can_list_suppliers(
        self,
        api_client,
        procurement_user,
        supplier,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.get(
            reverse("supplier-list")
        )

        assert response.status_code == 200

    def test_inventory_user_can_list_suppliers(
        self,
        api_client,
        inventory_user,
        supplier,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.get(
            reverse("supplier-list")
        )

        assert response.status_code == 200

    def test_accountant_can_list_suppliers(
        self,
        api_client,
        accountant_user,
        supplier,
    ):
        api_client.force_authenticate(user=accountant_user)

        response = api_client.get(
            reverse("supplier-list")
        )

        assert response.status_code == 200

    def test_sales_user_can_list_suppliers(
        self,
        api_client,
        sales_user,
        supplier,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.get(
            reverse("supplier-list")
        )

        assert response.status_code == 200

    def test_procurement_user_can_retrieve_supplier(
        self,
        api_client,
        procurement_user,
        supplier,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.get(
            reverse(
                "supplier-detail",
                kwargs={"pk": supplier.pk},
            )
        )

        assert response.status_code == 200
        assert response.data["supplier_number"] == supplier.supplier_number

    def test_procurement_user_can_create_supplier(
        self,
        api_client,
        procurement_user,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.post(
            reverse("supplier-list"),
            {
                "name": "New Paint Supplier",
                "contact_person": "Peter Doe",
                "email": "new-supplier@example.com",
                "phone_number": "+250788000022",
                "country": "Rwanda",
                "payment_terms_days": 30,
                "status": Supplier.Status.PENDING,
            },
            format="json",
        )

        assert response.status_code == 201

        created_supplier = Supplier.objects.get(
            supplier_number=response.data["supplier_number"]
        )

        assert created_supplier.name == "New Paint Supplier"
        assert created_supplier.created_by == procurement_user
        assert created_supplier.supplier_number.startswith("SUP-")

    def test_supplier_creation_requires_name(
        self,
        api_client,
        procurement_user,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.post(
            reverse("supplier-list"),
            {
                "phone_number": "+250788000023",
            },
            format="json",
        )

        assert response.status_code == 400
        assert "name" in response.data

    def test_supplier_creation_requires_phone_number(
        self,
        api_client,
        procurement_user,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.post(
            reverse("supplier-list"),
            {
                "name": "Supplier Without Phone",
            },
            format="json",
        )

        assert response.status_code == 400
        assert "phone_number" in response.data

    def test_manager_can_create_supplier(
        self,
        api_client,
        manager_user,
    ):
        api_client.force_authenticate(user=manager_user)

        response = api_client.post(
            reverse("supplier-list"),
            {
                "name": "Manager Created Supplier",
                "phone_number": "+250788000024",
            },
            format="json",
        )

        assert response.status_code == 201

    def test_inventory_user_cannot_create_supplier(
        self,
        api_client,
        inventory_user,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.post(
            reverse("supplier-list"),
            {
                "name": "Unauthorized Supplier",
                "phone_number": "+250788000025",
            },
            format="json",
        )

        assert response.status_code == 403

    def test_accountant_cannot_create_supplier(
        self,
        api_client,
        accountant_user,
    ):
        api_client.force_authenticate(user=accountant_user)

        response = api_client.post(
            reverse("supplier-list"),
            {
                "name": "Accountant Supplier",
                "phone_number": "+250788000026",
            },
            format="json",
        )

        assert response.status_code == 403

    def test_sales_user_cannot_create_supplier(
        self,
        api_client,
        sales_user,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.post(
            reverse("supplier-list"),
            {
                "name": "Sales Supplier",
                "phone_number": "+250788000027",
            },
            format="json",
        )

        assert response.status_code == 403

    def test_procurement_user_can_update_supplier(
        self,
        api_client,
        procurement_user,
        supplier,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.patch(
            reverse(
                "supplier-detail",
                kwargs={"pk": supplier.pk},
            ),
            {
                "name": "Updated Supplier Name",
            },
            format="json",
        )

        assert response.status_code == 200

        supplier.refresh_from_db()
        assert supplier.name == "Updated Supplier Name"

    def test_inventory_user_cannot_update_supplier(
        self,
        api_client,
        inventory_user,
        supplier,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.patch(
            reverse(
                "supplier-detail",
                kwargs={"pk": supplier.pk},
            ),
            {
                "name": "Unauthorized Update",
            },
            format="json",
        )

        assert response.status_code == 403

    def test_procurement_user_can_delete_supplier(
        self,
        api_client,
        procurement_user,
        supplier,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.delete(
            reverse(
                "supplier-detail",
                kwargs={"pk": supplier.pk},
            )
        )

        assert response.status_code == 204
        assert not Supplier.objects.filter(pk=supplier.pk).exists()

    def test_sales_user_cannot_delete_supplier(
        self,
        api_client,
        sales_user,
        supplier,
    ):
        api_client.force_authenticate(user=sales_user)

        response = api_client.delete(
            reverse(
                "supplier-detail",
                kwargs={"pk": supplier.pk},
            )
        )

        assert response.status_code == 403
        assert Supplier.objects.filter(pk=supplier.pk).exists()

    def test_supplier_contacts_action(
        self,
        api_client,
        procurement_user,
        supplier,
        supplier_contact,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.get(
            reverse(
                "supplier-contacts",
                kwargs={"pk": supplier.pk},
            )
        )

        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["full_name"] == "Jane Contact"

    def test_supplier_products_action(
        self,
        api_client,
        procurement_user,
        supplier,
        supplier_product,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.get(
            reverse(
                "supplier-products",
                kwargs={"pk": supplier.pk},
            )
        )

        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["sku"] == "VIEW-PNT-001-20L"

    def test_activate_supplier(
        self,
        api_client,
        procurement_user,
        supplier,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.patch(
            reverse(
                "supplier-activate",
                kwargs={"pk": supplier.pk},
            ),
            {},
            format="json",
        )

        assert response.status_code == 200

        supplier.refresh_from_db()
        assert supplier.status == Supplier.Status.ACTIVE

    def test_deactivate_supplier(
        self,
        api_client,
        procurement_user,
        supplier,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.patch(
            reverse(
                "supplier-deactivate",
                kwargs={"pk": supplier.pk},
            ),
            {},
            format="json",
        )

        assert response.status_code == 200

        supplier.refresh_from_db()
        assert supplier.status == Supplier.Status.INACTIVE

    def test_inventory_user_cannot_activate_supplier(
        self,
        api_client,
        inventory_user,
        supplier,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.patch(
            reverse(
                "supplier-activate",
                kwargs={"pk": supplier.pk},
            ),
            {},
            format="json",
        )

        assert response.status_code == 403


@pytest.mark.django_db
class TestSupplierContactViews:

    def test_procurement_user_can_list_contacts(
        self,
        api_client,
        procurement_user,
        supplier_contact,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.get(
            reverse("supplier-contact-list")
        )

        assert response.status_code == 200

    def test_procurement_user_can_create_contact(
        self,
        api_client,
        procurement_user,
        supplier,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.post(
            reverse("supplier-contact-list"),
            {
                "supplier": str(supplier.pk),
                "full_name": "New Supplier Contact",
                "job_title": "Account Manager",
                "email": "new-contact@example.com",
                "phone_number": "+250788000028",
                "is_primary": True,
            },
            format="json",
        )

        assert response.status_code == 201

        assert SupplierContact.objects.filter(
            supplier=supplier,
            full_name="New Supplier Contact",
        ).exists()

    def test_contact_creation_requires_full_name(
        self,
        api_client,
        procurement_user,
        supplier,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.post(
            reverse("supplier-contact-list"),
            {
                "supplier": str(supplier.pk),
                "phone_number": "+250788000029",
            },
            format="json",
        )

        assert response.status_code == 400
        assert "full_name" in response.data

    def test_inventory_user_can_read_contacts(
        self,
        api_client,
        inventory_user,
        supplier_contact,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.get(
            reverse("supplier-contact-list")
        )

        assert response.status_code == 200

    def test_inventory_user_cannot_create_contact(
        self,
        api_client,
        inventory_user,
        supplier,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.post(
            reverse("supplier-contact-list"),
            {
                "supplier": str(supplier.pk),
                "full_name": "Unauthorized Contact",
                "phone_number": "+250788000030",
            },
            format="json",
        )

        assert response.status_code == 403

    def test_filter_contacts_by_supplier(
        self,
        api_client,
        procurement_user,
        supplier,
        supplier_contact,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.get(
            reverse("supplier-contact-list"),
            {"supplier": str(supplier.pk)},
        )

        assert response.status_code == 200
        assert len(response.data) == 1


@pytest.mark.django_db
class TestSupplierProductViews:

    def test_procurement_user_can_list_supplier_products(
        self,
        api_client,
        procurement_user,
        supplier_product,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.get(
            reverse("supplier-product-list")
        )

        assert response.status_code == 200

    def test_procurement_user_can_create_supplier_product(
        self,
        api_client,
        procurement_user,
        supplier,
        product_variant,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.post(
            reverse("supplier-product-list"),
            {
                "supplier": str(supplier.pk),
                "product_variant": str(product_variant.pk),
                "supplier_product_code": "NEW-SUP-PROD-001",
                "last_purchase_price": "15000.00",
                "currency": "RWF",
                "minimum_order_quantity": "2.000",
                "lead_time_days": 5,
                "is_preferred": True,
                "is_active": True,
            },
            format="json",
        )

        assert response.status_code == 201

        assert SupplierProduct.objects.filter(
            supplier=supplier,
            product_variant=product_variant,
        ).exists()

    def test_rejects_duplicate_supplier_product(
        self,
        api_client,
        procurement_user,
        supplier,
        product_variant,
        supplier_product,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.post(
            reverse("supplier-product-list"),
            {
                "supplier": str(supplier.pk),
                "product_variant": str(product_variant.pk),
            },
            format="json",
        )

        assert response.status_code == 400
        assert "non_field_errors" in response.data

    def test_inventory_user_can_read_supplier_products(
        self,
        api_client,
        inventory_user,
        supplier_product,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.get(
            reverse("supplier-product-list")
        )

        assert response.status_code == 200

    def test_inventory_user_cannot_create_supplier_product(
        self,
        api_client,
        inventory_user,
        supplier,
        product_variant,
    ):
        api_client.force_authenticate(user=inventory_user)

        response = api_client.post(
            reverse("supplier-product-list"),
            {
                "supplier": str(supplier.pk),
                "product_variant": str(product_variant.pk),
            },
            format="json",
        )

        assert response.status_code == 403

    def test_filter_supplier_products_by_supplier(
        self,
        api_client,
        procurement_user,
        supplier,
        supplier_product,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.get(
            reverse("supplier-product-list"),
            {"supplier": str(supplier.pk)},
        )

        assert response.status_code == 200
        assert len(response.data) == 1

    def test_supplier_product_detail(
        self,
        api_client,
        procurement_user,
        supplier_product,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.get(
            reverse(
                "supplier-product-detail",
                kwargs={"pk": supplier_product.pk},
            )
        )

        assert response.status_code == 200
        assert response.data["sku"] == "VIEW-PNT-001-20L"

    def test_procurement_user_can_update_supplier_product(
        self,
        api_client,
        procurement_user,
        supplier_product,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.patch(
            reverse(
                "supplier-product-detail",
                kwargs={"pk": supplier_product.pk},
            ),
            {
                "lead_time_days": 10,
            },
            format="json",
        )

        assert response.status_code == 200

        supplier_product.refresh_from_db()
        assert supplier_product.lead_time_days == 10

    def test_procurement_user_can_delete_supplier_product(
        self,
        api_client,
        procurement_user,
        supplier_product,
    ):
        api_client.force_authenticate(user=procurement_user)

        response = api_client.delete(
            reverse(
                "supplier-product-detail",
                kwargs={"pk": supplier_product.pk},
            )
        )

        assert response.status_code == 204
        assert not SupplierProduct.objects.filter(
            pk=supplier_product.pk
        ).exists()