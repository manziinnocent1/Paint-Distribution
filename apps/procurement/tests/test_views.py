from decimal import Decimal
from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import User
from apps.catalog.models import Category, Product, ProductVariant
from apps.suppliers.models import Supplier
from apps.inventory.models import Warehouse

from apps.procurement.models import (
    PurchaseRequest,
    PurchaseRequestItem,
    PurchaseOrder,
    PurchaseOrderItem,
    GoodsReceipt,
)


def response_items(response):
    """
    Supports both paginated and unpaginated API responses.
    """
    if isinstance(response.data, dict) and "results" in response.data:
        return response.data["results"]

    return response.data


class ProcurementViewTestBase(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.procurement_user = User.objects.create(
            email="procurement@example.com",
            first_name="Procurement",
            last_name="Officer",
            role="procurement_officer",
        )

        cls.manager = User.objects.create(
            email="manager@example.com",
            first_name="Business",
            last_name="Manager",
            role="manager",
        )

        cls.inventory_manager = User.objects.create(
            email="inventory@example.com",
            first_name="Inventory",
            last_name="Manager",
            role="inventory_manager",
        )

        cls.storekeeper = User.objects.create(
            email="storekeeper@example.com",
            first_name="Store",
            last_name="Keeper",
            role="storekeeper",
        )

        cls.accountant = User.objects.create(
            email="accountant@example.com",
            first_name="Finance",
            last_name="Officer",
            role="accountant",
        )

        cls.sales_person = User.objects.create(
            email="sales@example.com",
            first_name="Sales",
            last_name="Person",
            role="sales_person",
        )

        cls.category = Category.objects.create(
            name="View Paint",
            slug="view-paint",
        )

        cls.product = Product.objects.create(
            name="Exterior Paint",
            slug="exterior-paint",
            product_code="VIEW-PROD-001",
            category=cls.category,
            status=Product.Status.ACTIVE,
        )

        cls.variant = ProductVariant.objects.create(
            product=cls.product,
            name="White 20 Litre",
            sku="VIEW-PAINT-001",
            selling_price=Decimal("50000.00"),
            cost_price=Decimal("30000.00"),
            is_active=True,
        )

        cls.supplier = Supplier.objects.create(
            supplier_number="VIEW-SUP-001",
            name="Kigali Paint Supplier",
            phone_number="+250788000004",
            status=Supplier.Status.ACTIVE,
        )

        cls.warehouse = Warehouse.objects.create(
            name="View Main Warehouse",
            code="VIEW-WH-001",
            status=Warehouse.Status.ACTIVE,
        )

    def setUp(self):
        self.client = APIClient()

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def create_purchase_request(self, **kwargs):
        data = {
            "request_number": "VIEW-PR-001",
            "requested_by": self.procurement_user,
            "department": "Procurement",
            "reason": "Restocking paint",
        }
        data.update(kwargs)

        return PurchaseRequest.objects.create(**data)

    def create_purchase_request_item(self, purchase_request, **kwargs):
        data = {
            "purchase_request": purchase_request,
            "product_variant": self.variant,
            "quantity": Decimal("5.000"),
        }
        data.update(kwargs)

        return PurchaseRequestItem.objects.create(**data)

    def create_purchase_order(self, **kwargs):
        data = {
            "purchase_order_number": "VIEW-PO-001",
            "supplier": self.supplier,
            "warehouse": self.warehouse,
            "order_date": timezone.localdate(),
            "created_by": self.procurement_user,
        }
        data.update(kwargs)

        return PurchaseOrder.objects.create(**data)

    def create_purchase_order_item(self, order, **kwargs):
        data = {
            "purchase_order": order,
            "product_variant": self.variant,
            "quantity_ordered": Decimal("10.000"),
            "unit_cost": Decimal("30000.00"),
        }
        data.update(kwargs)

        return PurchaseOrderItem.objects.create(**data)

    def create_goods_receipt(self, order, **kwargs):
        data = {
            "receipt_number": "VIEW-GRN-001",
            "purchase_order": order,
            "received_date": timezone.localdate(),
            "received_by": self.inventory_manager,
            "status": GoodsReceipt.Status.CONFIRMED,
        }
        data.update(kwargs)

        return GoodsReceipt.objects.create(**data)


class PurchaseRequestViewTests(ProcurementViewTestBase):

    def test_unauthenticated_user_cannot_list_purchase_requests(self):
        response = self.client.get(
            reverse("purchase-request-list")
        )

        self.assertIn(
            response.status_code,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
        )

    def test_procurement_officer_can_list_purchase_requests(self):
        self.authenticate(self.procurement_user)

        self.create_purchase_request()

        response = self.client.get(
            reverse("purchase-request-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_items(response)), 1)

    def test_manager_can_list_purchase_requests(self):
        self.authenticate(self.manager)

        response = self.client.get(
            reverse("purchase-request-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_inventory_manager_can_read_purchase_requests(self):
        self.authenticate(self.inventory_manager)

        response = self.client.get(
            reverse("purchase-request-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_storekeeper_can_read_purchase_requests(self):
        self.authenticate(self.storekeeper)

        response = self.client.get(
            reverse("purchase-request-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_accountant_can_read_purchase_requests(self):
        self.authenticate(self.accountant)

        response = self.client.get(
            reverse("purchase-request-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_sales_person_cannot_read_purchase_requests(self):
        self.authenticate(self.sales_person)

        response = self.client.get(
            reverse("purchase-request-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_procurement_officer_can_create_purchase_request(self):
        self.authenticate(self.procurement_user)

        response = self.client.post(
            reverse("purchase-request-list"),
            {
                "department": "Procurement",
                "reason": "Restocking paint products",
                "required_date": (
                    timezone.localdate() + timedelta(days=7)
                ).isoformat(),
                "items": [
                    {
                        "product_variant": str(self.variant.pk),
                        "quantity": 5,
                        "notes": "Urgent order",
                    }
                ],
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        purchase_request = PurchaseRequest.objects.get(
            request_number=response.data["request_number"]
        )

        self.assertEqual(
            purchase_request.requested_by,
            self.procurement_user,
        )
        self.assertEqual(purchase_request.items.count(), 1)

    def test_sales_person_cannot_create_purchase_request(self):
        self.authenticate(self.sales_person)

        response = self.client.post(
            reverse("purchase-request-list"),
            {
                "department": "Sales",
                "reason": "Restocking",
                "items": [
                    {
                        "product_variant": str(self.variant.pk),
                        "quantity": 5,
                    }
                ],
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_purchase_request_creation_requires_items(self):
        self.authenticate(self.procurement_user)

        response = self.client.post(
            reverse("purchase-request-list"),
            {
                "department": "Procurement",
                "reason": "Restocking",
                "items": [],
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_purchase_request_can_be_retrieved(self):
        self.authenticate(self.procurement_user)

        purchase_request = self.create_purchase_request()

        response = self.client.get(
            reverse(
                "purchase-request-detail",
                kwargs={"pk": purchase_request.pk},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["request_number"],
            purchase_request.request_number,
        )

    def test_purchase_request_can_be_submitted(self):
        self.authenticate(self.procurement_user)

        purchase_request = self.create_purchase_request()
        self.create_purchase_request_item(purchase_request)

        response = self.client.post(
            reverse(
                "purchase-request-submit",
                kwargs={"pk": purchase_request.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        purchase_request.refresh_from_db()

        self.assertEqual(
            purchase_request.status,
            PurchaseRequest.Status.SUBMITTED,
        )

    def test_purchase_request_without_items_cannot_be_submitted(self):
        self.authenticate(self.procurement_user)

        purchase_request = self.create_purchase_request()

        response = self.client.post(
            reverse(
                "purchase-request-submit",
                kwargs={"pk": purchase_request.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_purchase_request_cannot_be_submitted_twice(self):
        self.authenticate(self.procurement_user)

        purchase_request = self.create_purchase_request(
            status=PurchaseRequest.Status.SUBMITTED,
        )
        self.create_purchase_request_item(purchase_request)

        response = self.client.post(
            reverse(
                "purchase-request-submit",
                kwargs={"pk": purchase_request.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_manager_can_approve_submitted_purchase_request(self):
        self.authenticate(self.manager)

        purchase_request = self.create_purchase_request(
            status=PurchaseRequest.Status.SUBMITTED,
        )

        response = self.client.post(
            reverse(
                "purchase-request-approve",
                kwargs={"pk": purchase_request.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        purchase_request.refresh_from_db()

        self.assertEqual(
            purchase_request.status,
            PurchaseRequest.Status.APPROVED,
        )
        self.assertEqual(
            purchase_request.approved_by,
            self.manager,
        )
        self.assertIsNotNone(purchase_request.approved_at)

    def test_purchase_request_cannot_be_approved_before_submission(self):
        self.authenticate(self.manager)

        purchase_request = self.create_purchase_request()

        response = self.client.post(
            reverse(
                "purchase-request-approve",
                kwargs={"pk": purchase_request.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_manager_can_reject_submitted_purchase_request(self):
        self.authenticate(self.manager)

        purchase_request = self.create_purchase_request(
            status=PurchaseRequest.Status.SUBMITTED,
        )

        response = self.client.post(
            reverse(
                "purchase-request-reject",
                kwargs={"pk": purchase_request.pk},
            ),
            {
                "rejection_reason": "The requested quantity is too high.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        purchase_request.refresh_from_db()

        self.assertEqual(
            purchase_request.status,
            PurchaseRequest.Status.REJECTED,
        )
        self.assertEqual(
            purchase_request.rejection_reason,
            "The requested quantity is too high.",
        )

    def test_rejection_requires_a_reason(self):
        self.authenticate(self.manager)

        purchase_request = self.create_purchase_request(
            status=PurchaseRequest.Status.SUBMITTED,
        )

        response = self.client.post(
            reverse(
                "purchase-request-reject",
                kwargs={"pk": purchase_request.pk},
            ),
            {"rejection_reason": ""},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_purchase_request_status_filter(self):
        self.authenticate(self.procurement_user)

        self.create_purchase_request(
            request_number="VIEW-PR-DRAFT",
            status=PurchaseRequest.Status.DRAFT,
        )
        self.create_purchase_request(
            request_number="VIEW-PR-SUBMITTED",
            status=PurchaseRequest.Status.SUBMITTED,
        )

        response = self.client.get(
            reverse("purchase-request-list"),
            {"status": "submitted"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        items = response_items(response)

        self.assertEqual(len(items), 1)
        self.assertEqual(
            items[0]["status"],
            PurchaseRequest.Status.SUBMITTED,
        )

    def test_purchase_request_search(self):
        self.authenticate(self.procurement_user)

        self.create_purchase_request(
            request_number="VIEW-PR-SEARCH",
            department="Special Projects",
        )

        response = self.client.get(
            reverse("purchase-request-list"),
            {"search": "Special Projects"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_items(response)), 1)


class PurchaseOrderViewTests(ProcurementViewTestBase):

    def test_procurement_officer_can_list_purchase_orders(self):
        self.authenticate(self.procurement_user)

        self.create_purchase_order()

        response = self.client.get(
            reverse("purchase-order-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_items(response)), 1)

    def test_inventory_manager_can_read_purchase_orders(self):
        self.authenticate(self.inventory_manager)

        response = self.client.get(
            reverse("purchase-order-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_sales_person_cannot_read_purchase_orders(self):
        self.authenticate(self.sales_person)

        response = self.client.get(
            reverse("purchase-order-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_procurement_officer_can_create_purchase_order(self):
        self.authenticate(self.procurement_user)

        response = self.client.post(
            reverse("purchase-order-list"),
            {
                "supplier": str(self.supplier.pk),
                "warehouse": str(self.warehouse.pk),
                "order_date": timezone.localdate().isoformat(),
                "expected_delivery_date": (
                    timezone.localdate() + timedelta(days=7)
                ).isoformat(),
                "currency": "RWF",
                "notes": "First order",
                "items": [
                    {
                        "product_variant": str(self.variant.pk),
                        "quantity_ordered": 10,
                        "unit_cost": "30000.00",
                        "tax_rate": "18.00",
                    }
                ],
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        order = PurchaseOrder.objects.get(
            purchase_order_number=response.data["purchase_order_number"]
        )

        self.assertEqual(order.created_by, self.procurement_user)
        self.assertEqual(order.items.count(), 1)
        self.assertEqual(order.subtotal, Decimal("300000.00"))
        self.assertEqual(order.tax_amount, Decimal("54000.00"))
        self.assertEqual(order.total_amount, Decimal("354000.00"))

    def test_inventory_manager_cannot_create_purchase_order(self):
        self.authenticate(self.inventory_manager)

        response = self.client.post(
            reverse("purchase-order-list"),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_purchase_order_creation_rejects_inactive_supplier(self):
        self.authenticate(self.procurement_user)

        inactive_supplier = Supplier.objects.create(
            supplier_number="VIEW-SUP-INACTIVE",
            name="Inactive Supplier",
            phone_number="+250788000005",
            status=Supplier.Status.INACTIVE,
        )

        response = self.client.post(
            reverse("purchase-order-list"),
            {
                "supplier": str(inactive_supplier.pk),
                "warehouse": str(self.warehouse.pk),
                "order_date": timezone.localdate().isoformat(),
                "items": [
                    {
                        "product_variant": str(self.variant.pk),
                        "quantity_ordered": 2,
                        "unit_cost": "30000.00",
                    }
                ],
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_purchase_order_can_be_retrieved(self):
        self.authenticate(self.procurement_user)

        order = self.create_purchase_order()

        response = self.client.get(
            reverse(
                "purchase-order-detail",
                kwargs={"pk": order.pk},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["purchase_order_number"],
            order.purchase_order_number,
        )

    def test_purchase_order_can_be_submitted(self):
        self.authenticate(self.procurement_user)

        order = self.create_purchase_order()
        self.create_purchase_order_item(order)

        response = self.client.post(
            reverse(
                "purchase-order-submit",
                kwargs={"pk": order.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        order.refresh_from_db()

        self.assertEqual(
            order.status,
            PurchaseOrder.Status.SUBMITTED,
        )

    def test_purchase_order_without_items_cannot_be_submitted(self):
        self.authenticate(self.procurement_user)

        order = self.create_purchase_order()

        response = self.client.post(
            reverse(
                "purchase-order-submit",
                kwargs={"pk": order.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_manager_can_approve_submitted_purchase_order(self):
        self.authenticate(self.manager)

        order = self.create_purchase_order(
            status=PurchaseOrder.Status.SUBMITTED,
        )
        self.create_purchase_order_item(order)

        response = self.client.post(
            reverse(
                "purchase-order-approve",
                kwargs={"pk": order.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        order.refresh_from_db()

        self.assertEqual(
            order.status,
            PurchaseOrder.Status.APPROVED,
        )
        self.assertEqual(order.approved_by, self.manager)
        self.assertIsNotNone(order.approved_at)

    def test_purchase_order_cannot_be_approved_without_items(self):
        self.authenticate(self.manager)

        order = self.create_purchase_order(
            status=PurchaseOrder.Status.SUBMITTED,
        )

        response = self.client.post(
            reverse(
                "purchase-order-approve",
                kwargs={"pk": order.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_purchase_order_cannot_be_approved_before_submission(self):
        self.authenticate(self.manager)

        order = self.create_purchase_order()
        self.create_purchase_order_item(order)

        response = self.client.post(
            reverse(
                "purchase-order-approve",
                kwargs={"pk": order.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_purchase_order_status_filter(self):
        self.authenticate(self.procurement_user)

        self.create_purchase_order(
            purchase_order_number="VIEW-PO-DRAFT",
            status=PurchaseOrder.Status.DRAFT,
        )
        self.create_purchase_order(
            purchase_order_number="VIEW-PO-APPROVED",
            status=PurchaseOrder.Status.APPROVED,
        )

        response = self.client.get(
            reverse("purchase-order-list"),
            {"status": "approved"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        items = response_items(response)

        self.assertEqual(len(items), 1)
        self.assertEqual(
            items[0]["status"],
            PurchaseOrder.Status.APPROVED,
        )

    def test_purchase_order_supplier_filter(self):
        self.authenticate(self.procurement_user)

        self.create_purchase_order()

        response = self.client.get(
            reverse("purchase-order-list"),
            {"supplier": str(self.supplier.pk)},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_items(response)), 1)

    def test_purchase_order_search(self):
        self.authenticate(self.procurement_user)

        self.create_purchase_order(
            purchase_order_number="VIEW-PO-SEARCH",
        )

        response = self.client.get(
            reverse("purchase-order-list"),
            {"search": "VIEW-PO-SEARCH"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_items(response)), 1)

    @patch("apps.procurement.views.receive_purchase_order")
    def test_inventory_manager_can_receive_purchase_order(
        self,
        mock_receive,
    ):
        self.authenticate(self.inventory_manager)

        order = self.create_purchase_order(
            status=PurchaseOrder.Status.APPROVED,
        )
        order_item = self.create_purchase_order_item(order)

        receipt = self.create_goods_receipt(
            order,
            receipt_number="VIEW-GRN-MOCK",
        )
        mock_receive.return_value = receipt

        response = self.client.post(
            reverse(
                "purchase-order-receive",
                kwargs={"pk": order.pk},
            ),
            {
                "received_date": timezone.localdate().isoformat(),
                "supplier_delivery_note": "DELIVERY-001",
                "notes": "Goods received",
                "items": [
                    {
                        "purchase_order_item": str(order_item.pk),
                        "quantity_received": 5,
                        "quantity_rejected": 0,
                    }
                ],
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        mock_receive.assert_called_once()

    def test_sales_person_cannot_receive_purchase_order(self):
        self.authenticate(self.sales_person)

        order = self.create_purchase_order(
            status=PurchaseOrder.Status.APPROVED,
        )

        response = self.client.post(
            reverse(
                "purchase-order-receive",
                kwargs={"pk": order.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )


class GoodsReceiptViewTests(ProcurementViewTestBase):

    def test_procurement_officer_can_list_goods_receipts(self):
        self.authenticate(self.procurement_user)

        order = self.create_purchase_order()
        self.create_goods_receipt(order)

        response = self.client.get(
            reverse("goods-receipt-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_items(response)), 1)

    def test_inventory_manager_can_list_goods_receipts(self):
        self.authenticate(self.inventory_manager)

        response = self.client.get(
            reverse("goods-receipt-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_sales_person_cannot_list_goods_receipts(self):
        self.authenticate(self.sales_person)

        response = self.client.get(
            reverse("goods-receipt-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_goods_receipt_can_be_retrieved(self):
        self.authenticate(self.procurement_user)

        order = self.create_purchase_order()
        receipt = self.create_goods_receipt(order)

        response = self.client.get(
            reverse(
                "goods-receipt-detail",
                kwargs={"pk": receipt.pk},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["receipt_number"],
            receipt.receipt_number,
        )

    def test_goods_receipt_is_read_only(self):
        self.authenticate(self.procurement_user)

        response = self.client.post(
            reverse("goods-receipt-list"),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def test_goods_receipt_purchase_order_filter(self):
        self.authenticate(self.procurement_user)

        order = self.create_purchase_order()
        self.create_goods_receipt(order)

        response = self.client.get(
            reverse("goods-receipt-list"),
            {"purchase_order": str(order.pk)},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_items(response)), 1)

    def test_goods_receipt_status_filter(self):
        self.authenticate(self.procurement_user)

        order = self.create_purchase_order()

        self.create_goods_receipt(
            order,
            receipt_number="VIEW-GRN-CONFIRMED",
            status=GoodsReceipt.Status.CONFIRMED,
        )
        self.create_goods_receipt(
            order,
            receipt_number="VIEW-GRN-DRAFT",
            status=GoodsReceipt.Status.DRAFT,
        )

        response = self.client.get(
            reverse("goods-receipt-list"),
            {"status": "CONFIRMED"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        items = response_items(response)

        self.assertEqual(len(items), 1)
        self.assertEqual(
            items[0]["status"],
            GoodsReceipt.Status.CONFIRMED,
        )

    def test_goods_receipt_search(self):
        self.authenticate(self.procurement_user)

        order = self.create_purchase_order()

        self.create_goods_receipt(
            order,
            receipt_number="VIEW-GRN-SEARCH",
            supplier_delivery_note="DELIVERY-SEARCH-001",
        )

        response = self.client.get(
            reverse("goods-receipt-list"),
            {"search": "DELIVERY-SEARCH-001"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_items(response)), 1)