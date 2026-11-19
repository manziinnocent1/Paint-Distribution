from datetime import timedelta
from decimal import Decimal
from types import SimpleNamespace

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
)

from apps.procurement.serializers import (
    PurchaseRequestItemSerializer,
    PurchaseRequestSerializer,
    PurchaseRequestCreateSerializer,
    PurchaseOrderItemSerializer,
    PurchaseOrderSerializer,
    PurchaseOrderItemCreateSerializer,
    PurchaseOrderCreateSerializer,
    GoodsReceiptItemSerializer,
    GoodsReceiptSerializer,
    GoodsReceiptItemCreateSerializer,
    GoodsReceiptCreateSerializer,
)


class ProcurementSerializerTestBase(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create(
            email="serializer@example.com",
            first_name="Test",
            last_name="User",
            role="procurement_officer",
        )

        cls.category = Category.objects.create(
            name="Serializer Paint",
            slug="serializer-paint",
        )

        cls.product = Product.objects.create(
            name="Wall Paint",
            slug="wall-paint",
            product_code="SER-PROD-001",
            category=cls.category,
            status=Product.Status.ACTIVE,
        )

        cls.variant = ProductVariant.objects.create(
            product=cls.product,
            name="White 20 Litre",
            sku="SER-PAINT-001",
            selling_price=Decimal("50000.00"),
            cost_price=Decimal("30000.00"),
            is_active=True,
        )

        cls.inactive_variant = ProductVariant.objects.create(
            product=cls.product,
            name="Inactive Variant",
            sku="SER-PAINT-002",
            selling_price=Decimal("40000.00"),
            cost_price=Decimal("25000.00"),
            is_active=False,
        )

        cls.supplier = Supplier.objects.create(
            supplier_number="SER-SUP-001",
            name="Active Supplier",
            phone_number="+250788000002",
            status=Supplier.Status.ACTIVE,
        )

        cls.inactive_supplier = Supplier.objects.create(
            supplier_number="SER-SUP-002",
            name="Inactive Supplier",
            phone_number="+250788000003",
            status=Supplier.Status.INACTIVE,
        )

        cls.warehouse = Warehouse.objects.create(
            name="Serializer Warehouse",
            code="SER-WH-001",
            status=Warehouse.Status.ACTIVE,
        )

        cls.inactive_warehouse = Warehouse.objects.create(
            name="Inactive Warehouse",
            code="SER-WH-002",
            status=Warehouse.Status.INACTIVE,
        )

    def create_purchase_request(self, **kwargs):
        data = {
            "request_number": "SER-PR-001",
            "requested_by": self.user,
            "reason": "Restocking",
        }
        data.update(kwargs)
        return PurchaseRequest.objects.create(**data)

    def create_purchase_order(self, **kwargs):
        data = {
            "purchase_order_number": "SER-PO-001",
            "supplier": self.supplier,
            "warehouse": self.warehouse,
            "order_date": timezone.localdate(),
            "created_by": self.user,
        }
        data.update(kwargs)
        return PurchaseOrder.objects.create(**data)

    def create_order_item(self, order, **kwargs):
        data = {
            "purchase_order": order,
            "product_variant": self.variant,
            "quantity_ordered": Decimal("10.000"),
            "unit_cost": Decimal("30000.00"),
        }
        data.update(kwargs)
        return PurchaseOrderItem.objects.create(**data)

    def create_receipt(self, order, **kwargs):
        data = {
            "receipt_number": "SER-GRN-001",
            "purchase_order": order,
            "received_date": timezone.localdate(),
            "received_by": self.user,
        }
        data.update(kwargs)
        return GoodsReceipt.objects.create(**data)


class PurchaseRequestSerializerTests(ProcurementSerializerTestBase):

    def test_purchase_request_serializer_contains_expected_fields(self):
        serializer = PurchaseRequestSerializer()

        expected_fields = {
            "id",
            "request_number",
            "requested_by",
            "department",
            "reason",
            "required_date",
            "status",
            "approved_by",
            "approved_at",
            "rejection_reason",
            "created_at",
            "updated_at",
            "items",
            "requested_by_name",
        }

        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_purchase_request_read_only_fields(self):
        serializer = PurchaseRequestSerializer()

        for field in [
            "id",
            "request_number",
            "requested_by",
            "approved_by",
            "approved_at",
            "rejection_reason",
            "created_at",
            "updated_at",
            "items",
        ]:
            self.assertTrue(serializer.fields[field].read_only)

    def test_required_date_cannot_be_in_the_past(self):
        serializer = PurchaseRequestSerializer(
            data={
                "department": "Procurement",
                "reason": "Restocking",
                "required_date": (
                    timezone.localdate() - timedelta(days=1)
                ).isoformat(),
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("required_date", serializer.errors)

    def test_required_date_can_be_today(self):
        serializer = PurchaseRequestSerializer(
            data={
                "department": "Procurement",
                "reason": "Restocking",
                "required_date": timezone.localdate().isoformat(),
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_required_date_can_be_in_the_future(self):
        serializer = PurchaseRequestSerializer(
            data={
                "department": "Procurement",
                "reason": "Restocking",
                "required_date": (
                    timezone.localdate() + timedelta(days=5)
                ).isoformat(),
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_purchase_request_create_serializer_valid_data(self):
        serializer = PurchaseRequestCreateSerializer(
            data={
                "department": "Procurement",
                "reason": "Restocking paint",
                "required_date": (
                    timezone.localdate() + timedelta(days=5)
                ).isoformat(),
                "items": [
                    {
                        "product_variant": str(self.variant.pk),
                        "quantity": 5,
                        "notes": "Urgent",
                    }
                ],
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_purchase_request_create_serializer_requires_items(self):
        serializer = PurchaseRequestCreateSerializer(
            data={
                "department": "Procurement",
                "reason": "Restocking",
                "items": [],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)

    def test_purchase_request_create_serializer_rejects_inactive_variant(self):
        serializer = PurchaseRequestCreateSerializer(
            data={
                "department": "Procurement",
                "reason": "Restocking",
                "items": [
                    {
                        "product_variant": str(self.inactive_variant.pk),
                        "quantity": 5,
                    }
                ],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)

    def test_purchase_request_create_serializer_rejects_zero_quantity(self):
        serializer = PurchaseRequestCreateSerializer(
            data={
                "department": "Procurement",
                "reason": "Restocking",
                "items": [
                    {
                        "product_variant": str(self.variant.pk),
                        "quantity": 0,
                    }
                ],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)

    def test_purchase_request_create_serializer_creates_request_and_items(self):
        request = SimpleNamespace(user=self.user)

        serializer = PurchaseRequestCreateSerializer(
            data={
                "department": "Procurement",
                "reason": "Restocking",
                "items": [
                    {
                        "product_variant": str(self.variant.pk),
                        "quantity": 5,
                    }
                ],
            },
            context={"request": request},
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        purchase_request = serializer.save()

        self.assertEqual(purchase_request.requested_by, self.user)
        self.assertEqual(purchase_request.items.count(), 1)


class PurchaseOrderSerializerTests(ProcurementSerializerTestBase):

    def test_purchase_order_serializer_contains_expected_fields(self):
        serializer = PurchaseOrderSerializer()

        expected_fields = {
            "id",
            "purchase_order_number",
            "supplier",
            "warehouse",
            "purchase_request",
            "order_date",
            "expected_delivery_date",
            "currency",
            "subtotal",
            "tax_amount",
            "discount_amount",
            "total_amount",
            "status",
            "notes",
            "created_by",
            "approved_by",
            "approved_at",
            "created_at",
            "updated_at",
            "items",
            "supplier_name",
            "warehouse_name",
        }

        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_purchase_order_read_only_fields(self):
        serializer = PurchaseOrderSerializer()

        for field in [
            "id",
            "purchase_order_number",
            "subtotal",
            "tax_amount",
            "discount_amount",
            "total_amount",
            "created_by",
            "approved_by",
            "approved_at",
            "created_at",
            "updated_at",
            "items",
        ]:
            self.assertTrue(serializer.fields[field].read_only)

    def test_purchase_order_item_outstanding_quantity(self):
        order = self.create_purchase_order()

        item = self.create_order_item(
            order,
            quantity_ordered=Decimal("10.000"),
            quantity_received=Decimal("3.000"),
        )

        data = PurchaseOrderItemSerializer(item).data

        self.assertEqual(
            Decimal(str(data["quantity_outstanding"])),
            Decimal("7"),
        )

    def test_purchase_order_create_serializer_valid_data(self):
        serializer = PurchaseOrderCreateSerializer(
            data={
                "supplier": str(self.supplier.pk),
                "warehouse": str(self.warehouse.pk),
                "order_date": timezone.localdate().isoformat(),
                "items": [
                    {
                        "product_variant": str(self.variant.pk),
                        "quantity_ordered": 5,
                        "unit_cost": "30000.00",
                        "tax_rate": "18.00",
                    }
                ],
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_purchase_order_create_serializer_rejects_inactive_supplier(self):
        serializer = PurchaseOrderCreateSerializer(
            data={
                "supplier": str(self.inactive_supplier.pk),
                "warehouse": str(self.warehouse.pk),
                "order_date": timezone.localdate().isoformat(),
                "items": [
                    {
                        "product_variant": str(self.variant.pk),
                        "quantity_ordered": 5,
                        "unit_cost": "30000.00",
                    }
                ],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("supplier", serializer.errors)

    def test_purchase_order_create_serializer_rejects_inactive_warehouse(self):
        serializer = PurchaseOrderCreateSerializer(
            data={
                "supplier": str(self.supplier.pk),
                "warehouse": str(self.inactive_warehouse.pk),
                "order_date": timezone.localdate().isoformat(),
                "items": [
                    {
                        "product_variant": str(self.variant.pk),
                        "quantity_ordered": 5,
                        "unit_cost": "30000.00",
                    }
                ],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("warehouse", serializer.errors)

    def test_purchase_order_create_serializer_rejects_inactive_variant(self):
        serializer = PurchaseOrderCreateSerializer(
            data={
                "supplier": str(self.supplier.pk),
                "warehouse": str(self.warehouse.pk),
                "order_date": timezone.localdate().isoformat(),
                "items": [
                    {
                        "product_variant": str(self.inactive_variant.pk),
                        "quantity_ordered": 5,
                        "unit_cost": "30000.00",
                    }
                ],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)

    def test_expected_delivery_date_cannot_be_before_order_date(self):
        order_date = timezone.localdate()

        serializer = PurchaseOrderCreateSerializer(
            data={
                "supplier": str(self.supplier.pk),
                "warehouse": str(self.warehouse.pk),
                "order_date": order_date.isoformat(),
                "expected_delivery_date": (
                    order_date - timedelta(days=1)
                ).isoformat(),
                "items": [
                    {
                        "product_variant": str(self.variant.pk),
                        "quantity_ordered": 5,
                        "unit_cost": "30000.00",
                    }
                ],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("expected_delivery_date", serializer.errors)

    def test_purchase_order_create_serializer_rejects_empty_items(self):
        serializer = PurchaseOrderCreateSerializer(
            data={
                "supplier": str(self.supplier.pk),
                "warehouse": str(self.warehouse.pk),
                "order_date": timezone.localdate().isoformat(),
                "items": [],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)

    def test_purchase_order_item_rejects_zero_unit_cost(self):
        serializer = PurchaseOrderItemCreateSerializer(
            data={
                "product_variant": str(self.variant.pk),
                "quantity_ordered": 5,
                "unit_cost": "0.00",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("unit_cost", serializer.errors)

    def test_purchase_order_item_rejects_tax_rate_above_100(self):
        serializer = PurchaseOrderItemCreateSerializer(
            data={
                "product_variant": str(self.variant.pk),
                "quantity_ordered": 5,
                "unit_cost": "30000.00",
                "tax_rate": "101.00",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("tax_rate", serializer.errors)


class GoodsReceiptSerializerTests(ProcurementSerializerTestBase):

    def setUp(self):
        self.order = self.create_purchase_order()

        self.order_item = self.create_order_item(
            self.order,
            quantity_ordered=Decimal("10.000"),
        )

    def test_goods_receipt_serializer_contains_expected_fields(self):
        serializer = GoodsReceiptSerializer()

        expected_fields = {
            "id",
            "receipt_number",
            "purchase_order",
            "received_date",
            "supplier_delivery_note",
            "status",
            "received_by",
            "notes",
            "confirmed_at",
            "created_at",
            "items",
            "purchase_order_number",
        }

        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_goods_receipt_read_only_fields(self):
        serializer = GoodsReceiptSerializer()

        for field in [
            "id",
            "receipt_number",
            "received_by",
            "confirmed_at",
            "created_at",
            "items",
        ]:
            self.assertTrue(serializer.fields[field].read_only)

    def test_goods_receipt_create_serializer_valid_data(self):
        serializer = GoodsReceiptCreateSerializer(
            data={
                "purchase_order": str(self.order.pk),
                "received_date": timezone.localdate().isoformat(),
                "items": [
                    {
                        "purchase_order_item": str(self.order_item.pk),
                        "quantity_received": 5,
                        "quantity_rejected": 1,
                        "rejection_reason": "Damaged packaging",
                    }
                ],
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_goods_receipt_rejects_empty_items(self):
        serializer = GoodsReceiptCreateSerializer(
            data={
                "purchase_order": str(self.order.pk),
                "received_date": timezone.localdate().isoformat(),
                "items": [],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)

    def test_rejected_quantity_cannot_exceed_received_quantity(self):
        serializer = GoodsReceiptItemCreateSerializer(
            data={
                "purchase_order_item": str(self.order_item.pk),
                "quantity_received": 3,
                "quantity_rejected": 4,
                "rejection_reason": "Damaged",
            }
        )

        self.assertFalse(serializer.is_valid())

    def test_rejection_requires_a_reason(self):
        serializer = GoodsReceiptItemCreateSerializer(
            data={
                "purchase_order_item": str(self.order_item.pk),
                "quantity_received": 5,
                "quantity_rejected": 1,
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("rejection_reason", serializer.errors)

    def test_rejection_reason_is_not_required_when_nothing_is_rejected(self):
        serializer = GoodsReceiptItemCreateSerializer(
            data={
                "purchase_order_item": str(self.order_item.pk),
                "quantity_received": 5,
                "quantity_rejected": 0,
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_duplicate_purchase_order_items_are_rejected(self):
        serializer = GoodsReceiptCreateSerializer(
            data={
                "purchase_order": str(self.order.pk),
                "received_date": timezone.localdate().isoformat(),
                "items": [
                    {
                        "purchase_order_item": str(self.order_item.pk),
                        "quantity_received": 2,
                    },
                    {
                        "purchase_order_item": str(self.order_item.pk),
                        "quantity_received": 3,
                    },
                ],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)

    def test_item_must_belong_to_selected_purchase_order(self):
        another_order = self.create_purchase_order(
            purchase_order_number="SER-PO-002",
        )

        serializer = GoodsReceiptCreateSerializer(
            data={
                "purchase_order": str(another_order.pk),
                "received_date": timezone.localdate().isoformat(),
                "items": [
                    {
                        "purchase_order_item": str(self.order_item.pk),
                        "quantity_received": 2,
                    }
                ],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)