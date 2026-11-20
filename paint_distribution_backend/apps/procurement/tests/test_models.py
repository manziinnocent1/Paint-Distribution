from decimal import Decimal

from django.test import TestCase
from django.utils import timezone

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
    GoodsReceiptItem,
)


class ProcurementModelTestBase(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create(
            email="procurement@example.com",
            first_name="Procurement",
            last_name="Officer",
            role="procurement_officer",
        )

        cls.category = Category.objects.create(
            name="Paint",
            slug="paint",
        )

        cls.product = Product.objects.create(
            name="Interior Paint",
            slug="interior-paint",
            product_code="PROD-001",
            category=cls.category,
            status=Product.Status.ACTIVE,
        )

        cls.variant = ProductVariant.objects.create(
            product=cls.product,
            name="White 20 Litre",
            sku="PAINT-WHITE-20L",
            selling_price=Decimal("50000.00"),
            cost_price=Decimal("30000.00"),
            is_active=True,
        )

        cls.supplier = Supplier.objects.create(
            supplier_number="SUP-001",
            name="Kigali Paint Suppliers",
            phone_number="+250788000001",
            status=Supplier.Status.ACTIVE,
        )

        cls.warehouse = Warehouse.objects.create(
            name="Main Warehouse",
            code="WH-001",
            status=Warehouse.Status.ACTIVE,
        )

    def create_purchase_request(self, **kwargs):
        data = {
            "request_number": "PR-TEST-001",
            "requested_by": self.user,
            "department": "Procurement",
            "reason": "Restocking paint products",
        }
        data.update(kwargs)
        return PurchaseRequest.objects.create(**data)

    def create_purchase_order(self, **kwargs):
        data = {
            "purchase_order_number": "PO-TEST-001",
            "supplier": self.supplier,
            "warehouse": self.warehouse,
            "order_date": timezone.localdate(),
            "created_by": self.user,
        }
        data.update(kwargs)
        return PurchaseOrder.objects.create(**data)

    def create_purchase_order_item(self, purchase_order, **kwargs):
        data = {
            "purchase_order": purchase_order,
            "product_variant": self.variant,
            "quantity_ordered": Decimal("10.000"),
            "unit_cost": Decimal("30000.00"),
        }
        data.update(kwargs)
        return PurchaseOrderItem.objects.create(**data)

    def create_goods_receipt(self, purchase_order, **kwargs):
        data = {
            "receipt_number": "GRN-TEST-001",
            "purchase_order": purchase_order,
            "received_date": timezone.localdate(),
            "received_by": self.user,
        }
        data.update(kwargs)
        return GoodsReceipt.objects.create(**data)


class PurchaseRequestModelTests(ProcurementModelTestBase):

    def test_create_purchase_request(self):
        purchase_request = self.create_purchase_request()

        self.assertEqual(purchase_request.request_number, "PR-TEST-001")
        self.assertEqual(purchase_request.requested_by, self.user)
        self.assertEqual(
            purchase_request.status,
            PurchaseRequest.Status.DRAFT,
        )

    def test_default_status_is_draft(self):
        purchase_request = self.create_purchase_request()

        self.assertEqual(
            purchase_request.status,
            PurchaseRequest.Status.DRAFT,
        )

    def test_string_representation(self):
        purchase_request = self.create_purchase_request()

        self.assertEqual(str(purchase_request), "PR-TEST-001")

    def test_purchase_request_ordering(self):
        first = self.create_purchase_request(
            request_number="PR-ORDER-001",
        )
        second = self.create_purchase_request(
            request_number="PR-ORDER-002",
        )

        requests = list(PurchaseRequest.objects.all())

        self.assertEqual(requests[0], second)
        self.assertEqual(requests[1], first)

    def test_create_purchase_request_item(self):
        purchase_request = self.create_purchase_request()

        item = PurchaseRequestItem.objects.create(
            purchase_request=purchase_request,
            product_variant=self.variant,
            quantity=Decimal("5.000"),
            notes="Urgent restocking",
        )

        self.assertEqual(item.purchase_request, purchase_request)
        self.assertEqual(item.product_variant, self.variant)
        self.assertEqual(item.quantity, Decimal("5.000"))
        self.assertIn("PR-TEST-001", str(item))

    def test_purchase_request_items_related_name(self):
        purchase_request = self.create_purchase_request()

        PurchaseRequestItem.objects.create(
            purchase_request=purchase_request,
            product_variant=self.variant,
            quantity=Decimal("3.000"),
        )

        self.assertEqual(purchase_request.items.count(), 1)


class PurchaseOrderModelTests(ProcurementModelTestBase):

    def test_create_purchase_order(self):
        order = self.create_purchase_order()

        self.assertEqual(
            order.purchase_order_number,
            "PO-TEST-001",
        )
        self.assertEqual(order.supplier, self.supplier)
        self.assertEqual(order.warehouse, self.warehouse)
        self.assertEqual(order.created_by, self.user)
        self.assertEqual(order.status, PurchaseOrder.Status.DRAFT)

    def test_default_currency_is_rwf(self):
        order = self.create_purchase_order()

        self.assertEqual(order.currency, "RWF")

    def test_default_amounts_are_zero(self):
        order = self.create_purchase_order()

        self.assertEqual(order.subtotal, Decimal("0"))
        self.assertEqual(order.tax_amount, Decimal("0"))
        self.assertEqual(order.discount_amount, Decimal("0"))
        self.assertEqual(order.total_amount, Decimal("0"))

    def test_string_representation(self):
        order = self.create_purchase_order()

        self.assertEqual(str(order), "PO-TEST-001")

    def test_purchase_order_ordering(self):
        first = self.create_purchase_order(
            purchase_order_number="PO-ORDER-001",
        )
        second = self.create_purchase_order(
            purchase_order_number="PO-ORDER-002",
        )

        orders = list(PurchaseOrder.objects.all())

        self.assertEqual(orders[0], second)
        self.assertEqual(orders[1], first)

    def test_purchase_order_can_reference_purchase_request(self):
        purchase_request = self.create_purchase_request()

        order = self.create_purchase_order(
            purchase_order_number="PO-WITH-REQUEST",
            purchase_request=purchase_request,
        )

        self.assertEqual(order.purchase_request, purchase_request)
        self.assertEqual(
            purchase_request.purchase_orders.count(),
            1,
        )

    def test_create_purchase_order_item(self):
        order = self.create_purchase_order()

        item = self.create_purchase_order_item(
            order,
            quantity_ordered=Decimal("10.000"),
            quantity_received=Decimal("4.000"),
            unit_cost=Decimal("30000.00"),
        )

        self.assertEqual(item.purchase_order, order)
        self.assertEqual(item.product_variant, self.variant)
        self.assertEqual(item.quantity_outstanding, Decimal("6.000"))

    def test_quantity_outstanding_when_nothing_received(self):
        order = self.create_purchase_order()

        item = self.create_purchase_order_item(order)

        self.assertEqual(
            item.quantity_outstanding,
            Decimal("10.000"),
        )

    def test_quantity_outstanding_when_fully_received(self):
        order = self.create_purchase_order()

        item = self.create_purchase_order_item(
            order,
            quantity_received=Decimal("10.000"),
        )

        self.assertEqual(
            item.quantity_outstanding,
            Decimal("0.000"),
        )

    def test_purchase_order_items_related_name(self):
        order = self.create_purchase_order()
        self.create_purchase_order_item(order)

        self.assertEqual(order.items.count(), 1)


class GoodsReceiptModelTests(ProcurementModelTestBase):

    def setUp(self):
        self.order = self.create_purchase_order()
        self.order_item = self.create_purchase_order_item(self.order)

    def test_create_goods_receipt(self):
        receipt = self.create_goods_receipt(self.order)

        self.assertEqual(receipt.receipt_number, "GRN-TEST-001")
        self.assertEqual(receipt.purchase_order, self.order)
        self.assertEqual(receipt.received_by, self.user)
        self.assertEqual(receipt.status, GoodsReceipt.Status.DRAFT)

    def test_default_status_is_draft(self):
        receipt = self.create_goods_receipt(self.order)

        self.assertEqual(
            receipt.status,
            GoodsReceipt.Status.DRAFT,
        )

    def test_string_representation(self):
        receipt = self.create_goods_receipt(self.order)

        self.assertEqual(str(receipt), "GRN-TEST-001")

    def test_goods_receipt_ordering(self):
        first = self.create_goods_receipt(
            self.order,
            receipt_number="GRN-ORDER-001",
        )
        second = self.create_goods_receipt(
            self.order,
            receipt_number="GRN-ORDER-002",
        )

        receipts = list(GoodsReceipt.objects.all())

        self.assertEqual(receipts[0], second)
        self.assertEqual(receipts[1], first)

    def test_create_goods_receipt_item(self):
        receipt = self.create_goods_receipt(self.order)

        item = GoodsReceiptItem.objects.create(
            goods_receipt=receipt,
            purchase_order_item=self.order_item,
            quantity_received=Decimal("5.000"),
            quantity_rejected=Decimal("1.000"),
            rejection_reason="Damaged packaging",
        )

        self.assertEqual(item.goods_receipt, receipt)
        self.assertEqual(item.purchase_order_item, self.order_item)
        self.assertEqual(item.quantity_received, Decimal("5.000"))
        self.assertEqual(item.quantity_rejected, Decimal("1.000"))

    def test_goods_receipt_items_related_name(self):
        receipt = self.create_goods_receipt(self.order)

        GoodsReceiptItem.objects.create(
            goods_receipt=receipt,
            purchase_order_item=self.order_item,
            quantity_received=Decimal("5.000"),
        )

        self.assertEqual(receipt.items.count(), 1)