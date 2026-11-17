
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase

from apps.catalog.models import Category, Product, ProductVariant
from apps.inventory.models import Warehouse, StockLevel, StockMovement


User = get_user_model()


class WarehouseModelTests(TestCase):

    def setUp(self):
        self.warehouse = Warehouse.objects.create(
            name="Kigali Main Warehouse",
            code="KGL-MAIN",
            description="Main distribution warehouse",
            country="Rwanda",
            province="Kigali",
            district="Gasabo",
            sector="Remera",
            street_address="KG 11 Avenue",
            contact_person="John Doe",
            contact_phone="+250788000000",
        )

    def test_create_warehouse(self):
        self.assertEqual(self.warehouse.name, "Kigali Main Warehouse")
        self.assertEqual(self.warehouse.code, "KGL-MAIN")
        self.assertEqual(
            self.warehouse.status,
            Warehouse.Status.ACTIVE,
        )
        self.assertEqual(self.warehouse.country, "Rwanda")
        self.assertFalse(self.warehouse.is_default)

    def test_warehouse_string_representation(self):
        self.assertEqual(
            str(self.warehouse),
            "Kigali Main Warehouse (KGL-MAIN)",
        )

    def test_warehouse_can_be_inactive(self):
        self.warehouse.status = Warehouse.Status.INACTIVE
        self.warehouse.save()

        self.warehouse.refresh_from_db()

        self.assertEqual(
            self.warehouse.status,
            Warehouse.Status.INACTIVE,
        )

    def test_warehouse_code_must_be_unique(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Warehouse.objects.create(
                    name="Another Warehouse",
                    code="KGL-MAIN",
                )


class StockLevelModelTests(TestCase):

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
            status=Product.Status.ACTIVE,
        )

        self.variant = ProductVariant.objects.create(
            product=self.product,
            name="White 20 Litre",
            sku="PAINT-001-WHITE-20L",
            volume_ml=20000,
            unit_of_measure="litre",
            selling_price=Decimal("50000.00"),
            cost_price=Decimal("35000.00"),
        )

        self.warehouse = Warehouse.objects.create(
            name="Kigali Warehouse",
            code="KGL-001",
        )

        self.stock = StockLevel.objects.create(
            warehouse=self.warehouse,
            product_variant=self.variant,
            quantity_on_hand=Decimal("100.000"),
            quantity_reserved=Decimal("20.000"),
            reorder_level=Decimal("30.000"),
            maximum_stock_level=Decimal("200.000"),
        )

    def test_create_stock_level(self):
        self.assertEqual(
            self.stock.quantity_on_hand,
            Decimal("100.000"),
        )
        self.assertEqual(
            self.stock.quantity_reserved,
            Decimal("20.000"),
        )

    def test_available_quantity(self):
        self.assertEqual(
            self.stock.available_quantity,
            Decimal("80.000"),
        )

    def test_stock_is_low_when_available_quantity_equals_reorder_level(self):
        self.stock.quantity_on_hand = Decimal("50.000")
        self.stock.quantity_reserved = Decimal("20.000")
        self.stock.reorder_level = Decimal("30.000")

        self.assertEqual(
            self.stock.available_quantity,
            Decimal("30.000"),
        )
        self.assertTrue(self.stock.is_low_stock)

    def test_stock_is_low_when_available_quantity_is_below_reorder_level(self):
        self.stock.quantity_on_hand = Decimal("40.000")
        self.stock.quantity_reserved = Decimal("20.000")
        self.stock.reorder_level = Decimal("30.000")

        self.assertTrue(self.stock.is_low_stock)

    def test_stock_is_not_low_when_available_quantity_is_above_reorder_level(self):
        self.assertFalse(self.stock.is_low_stock)

    def test_stock_level_string_representation(self):
        expected = (
            f"{self.variant} - {self.warehouse}: "
            f"{self.stock.quantity_on_hand}"
        )

        self.assertEqual(str(self.stock), expected)

    def test_warehouse_and_product_variant_combination_must_be_unique(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                StockLevel.objects.create(
                    warehouse=self.warehouse,
                    product_variant=self.variant,
                    quantity_on_hand=Decimal("10.000"),
                )

    def test_reserved_quantity_cannot_exceed_quantity_on_hand(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                StockLevel.objects.create(
                    warehouse=self.warehouse,
                    product_variant=self.variant,
                    quantity_on_hand=Decimal("10.000"),
                    quantity_reserved=Decimal("15.000"),
                )


class StockMovementModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="inventory@example.com",
            password="TestPassword123!",
            role="manager",
        )

        self.category = Category.objects.create(
            name="Exterior Paint",
            slug="exterior-paint",
        )

        self.product = Product.objects.create(
            name="Weatherproof Exterior Paint",
            slug="weatherproof-exterior-paint",
            product_code="PAINT-002",
            category=self.category,
            product_type=Product.ProductType.PAINT,
        )

        self.variant = ProductVariant.objects.create(
            product=self.product,
            name="White 20 Litre",
            sku="PAINT-002-WHITE-20L",
            selling_price=Decimal("60000.00"),
        )

        self.warehouse = Warehouse.objects.create(
            name="Kigali Warehouse",
            code="KGL-002",
        )

        self.movement = StockMovement.objects.create(
            movement_number="STK-TEST000001",
            product_variant=self.variant,
            movement_type=StockMovement.MovementType.RECEIPT,
            to_warehouse=self.warehouse,
            quantity=Decimal("50.000"),
            unit_cost=Decimal("35000.00"),
            reference="PUR-001",
            reason="Initial stock receipt",
            performed_by=self.user,
        )

    def test_create_stock_movement(self):
        self.assertEqual(
            self.movement.movement_number,
            "STK-TEST000001",
        )
        self.assertEqual(
            self.movement.movement_type,
            StockMovement.MovementType.RECEIPT,
        )
        self.assertEqual(
            self.movement.quantity,
            Decimal("50.000"),
        )
        self.assertEqual(
            self.movement.performed_by,
            self.user,
        )

    def test_stock_movement_string_representation(self):
        self.assertEqual(
            str(self.movement),
            "STK-TEST000001 - RECEIPT",
        )

    def test_movement_number_must_be_unique(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                StockMovement.objects.create(
                    movement_number="STK-TEST000001",
                    product_variant=self.variant,
                    movement_type=StockMovement.MovementType.ISSUE,
                    from_warehouse=self.warehouse,
                    quantity=Decimal("5.000"),
                )

    def test_stock_movement_can_have_no_performed_by_user(self):
        self.movement.performed_by = None
        self.movement.save(update_fields=["performed_by"])

        self.movement.refresh_from_db()

        self.assertIsNone(self.movement.performed_by)
