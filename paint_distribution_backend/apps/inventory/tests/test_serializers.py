
from decimal import Decimal

from django.test import TestCase

from apps.catalog.models import Category, Product, ProductVariant
from apps.inventory.models import Warehouse, StockLevel, StockMovement
from apps.inventory.serializers import (
    WarehouseSerializer,
    StockLevelSerializer,
    StockMovementSerializer,
    StockOperationSerializer,
)


class InventorySerializerSetupMixin:

    def setUp(self):
        self.category = Category.objects.create(
            name="Interior Paint",
            slug="interior-paint",
        )

        self.product = Product.objects.create(
            name="Premium Interior Paint",
            slug="premium-interior-paint",
            product_code="PAINT-001",
            category=self.category,
            product_type=Product.ProductType.PAINT,
        )

        self.variant = ProductVariant.objects.create(
            product=self.product,
            name="White 20 Litre",
            sku="PAINT-001-WHITE-20L",
            selling_price=Decimal("50000.00"),
        )

        self.warehouse = Warehouse.objects.create(
            name="Kigali Warehouse",
            code="KGL-001",
        )

        self.second_warehouse = Warehouse.objects.create(
            name="Huye Warehouse",
            code="HYE-001",
        )


class WarehouseSerializerTests(
    InventorySerializerSetupMixin,
    TestCase,
):

    def test_serializes_warehouse(self):
        serializer = WarehouseSerializer(self.warehouse)

        self.assertEqual(
            serializer.data["name"],
            "Kigali Warehouse",
        )
        self.assertEqual(
            serializer.data["code"],
            "KGL-001",
        )
        self.assertEqual(
            serializer.data["status"],
            Warehouse.Status.ACTIVE,
        )
        self.assertIn("created_at", serializer.data)
        self.assertIn("updated_at", serializer.data)

    def test_valid_warehouse_data(self):
        serializer = WarehouseSerializer(
            data={
                "name": "Musanze Warehouse",
                "code": "MSZ-001",
                "description": "Northern distribution warehouse",
                "country": "Rwanda",
                "province": "Northern Province",
                "district": "Musanze",
                "sector": "Muhoza",
                "street_address": "Main Road",
                "contact_person": "Jane Doe",
                "contact_phone": "+250788111111",
                "status": Warehouse.Status.ACTIVE,
                "is_default": False,
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_warehouse_id_and_timestamps_are_read_only(self):
        serializer = WarehouseSerializer(
            data={
                "id": "00000000-0000-0000-0000-000000000001",
                "name": "New Warehouse",
                "code": "NEW-001",
                "created_at": "2026-01-01T00:00:00Z",
                "updated_at": "2026-01-01T00:00:00Z",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        warehouse = serializer.save()

        self.assertNotEqual(
            str(warehouse.pk),
            "00000000-0000-0000-0000-000000000001",
        )


class StockLevelSerializerTests(
    InventorySerializerSetupMixin,
    TestCase,
):

    def setUp(self):
        super().setUp()

        self.stock = StockLevel.objects.create(
            warehouse=self.warehouse,
            product_variant=self.variant,
            quantity_on_hand=Decimal("100.000"),
            quantity_reserved=Decimal("20.000"),
            reorder_level=Decimal("30.000"),
            maximum_stock_level=Decimal("200.000"),
        )

    def test_serializes_stock_level(self):
        serializer = StockLevelSerializer(self.stock)

        self.assertEqual(
            serializer.data["warehouse_name"],
            "Kigali Warehouse",
        )
        self.assertEqual(
            serializer.data["product_name"],
            "Premium Interior Paint",
        )
        self.assertEqual(
            serializer.data["sku"],
            "PAINT-001-WHITE-20L",
        )
        self.assertEqual(
            serializer.data["quantity_on_hand"],
            "100.000",
        )
        self.assertEqual(
            serializer.data["quantity_reserved"],
            "20.000",
        )
        self.assertEqual(
            serializer.data["available_quantity"],
            "80.000",
        )
        self.assertFalse(serializer.data["is_low_stock"])

    def test_stock_quantities_are_read_only(self):
        serializer = StockLevelSerializer(
            self.stock,
            data={
                "quantity_on_hand": "500.000",
                "quantity_reserved": "100.000",
                "reorder_level": "50.000",
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_stock = serializer.save()

        self.assertEqual(
            updated_stock.quantity_on_hand,
            Decimal("100.000"),
        )
        self.assertEqual(
            updated_stock.quantity_reserved,
            Decimal("20.000"),
        )
        self.assertEqual(
            updated_stock.reorder_level,
            Decimal("50.000"),
        )


class StockMovementSerializerTests(
    InventorySerializerSetupMixin,
    TestCase,
):

    def setUp(self):
        super().setUp()

        self.movement = StockMovement.objects.create(
            movement_number="STK-TEST000001",
            product_variant=self.variant,
            movement_type=StockMovement.MovementType.RECEIPT,
            to_warehouse=self.warehouse,
            quantity=Decimal("50.000"),
            unit_cost=Decimal("35000.00"),
            reference="PUR-001",
            reason="Initial stock receipt",
        )

    def test_serializes_stock_movement(self):
        serializer = StockMovementSerializer(self.movement)

        self.assertEqual(
            serializer.data["movement_number"],
            "STK-TEST000001",
        )
        self.assertEqual(
            serializer.data["product_name"],
            "Premium Interior Paint",
        )
        self.assertEqual(
            serializer.data["sku"],
            "PAINT-001-WHITE-20L",
        )
        self.assertEqual(
            serializer.data["destination_warehouse_name"],
            "Kigali Warehouse",
        )
        self.assertIsNone(
            serializer.data["source_warehouse_name"],
        )
        self.assertEqual(
            serializer.data["quantity"],
            "50.000",
        )

    def test_stock_movement_serializer_fields_are_read_only(self):
        serializer = StockMovementSerializer(
            self.movement,
            data={
                "movement_number": "STK-CHANGED",
                "quantity": "100.000",
                "reference": "CHANGED",
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_movement = serializer.save()

        self.assertEqual(
            updated_movement.movement_number,
            "STK-TEST000001",
        )
        self.assertEqual(
            updated_movement.quantity,
            Decimal("50.000"),
        )
        self.assertEqual(
            updated_movement.reference,
            "PUR-001",
        )


class StockOperationSerializerTests(
    InventorySerializerSetupMixin,
    TestCase,
):

    def test_valid_receipt_operation(self):
        serializer = StockOperationSerializer(
            data={
                "operation": "RECEIPT",
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "20.000",
                "unit_cost": "35000.00",
                "reference": "PUR-001",
                "reason": "New stock received",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_receipt_requires_destination_warehouse(self):
        serializer = StockOperationSerializer(
            data={
                "operation": "RECEIPT",
                "product_variant": str(self.variant.pk),
                "quantity": "20.000",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("to_warehouse", serializer.errors)

    def test_valid_issue_operation(self):
        serializer = StockOperationSerializer(
            data={
                "operation": "ISSUE",
                "product_variant": str(self.variant.pk),
                "from_warehouse": str(self.warehouse.pk),
                "quantity": "10.000",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_issue_requires_source_warehouse(self):
        serializer = StockOperationSerializer(
            data={
                "operation": "ISSUE",
                "product_variant": str(self.variant.pk),
                "quantity": "10.000",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("from_warehouse", serializer.errors)

    def test_valid_transfer_operation(self):
        serializer = StockOperationSerializer(
            data={
                "operation": "TRANSFER",
                "product_variant": str(self.variant.pk),
                "from_warehouse": str(self.warehouse.pk),
                "to_warehouse": str(self.second_warehouse.pk),
                "quantity": "10.000",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_transfer_requires_both_warehouses(self):
        serializer = StockOperationSerializer(
            data={
                "operation": "TRANSFER",
                "product_variant": str(self.variant.pk),
                "from_warehouse": str(self.warehouse.pk),
                "quantity": "10.000",
            }
        )

        self.assertFalse(serializer.is_valid())

    def test_transfer_rejects_same_source_and_destination(self):
        serializer = StockOperationSerializer(
            data={
                "operation": "TRANSFER",
                "product_variant": str(self.variant.pk),
                "from_warehouse": str(self.warehouse.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "10.000",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("to_warehouse", serializer.errors)

    def test_rejects_invalid_operation(self):
        serializer = StockOperationSerializer(
            data={
                "operation": "ADJUSTMENT",
                "product_variant": str(self.variant.pk),
                "quantity": "10.000",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("operation", serializer.errors)

    def test_rejects_zero_quantity(self):
        serializer = StockOperationSerializer(
            data={
                "operation": "RECEIPT",
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "0.000",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("quantity", serializer.errors)

    def test_rejects_negative_quantity(self):
        serializer = StockOperationSerializer(
            data={
                "operation": "RECEIPT",
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "-5.000",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("quantity", serializer.errors)

    def test_rejects_negative_unit_cost(self):
        serializer = StockOperationSerializer(
            data={
                "operation": "RECEIPT",
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "10.000",
                "unit_cost": "-100.00",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("unit_cost", serializer.errors)
