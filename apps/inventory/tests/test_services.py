
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from apps.catalog.models import Category, Product, ProductVariant
from apps.inventory.models import Warehouse, StockLevel, StockMovement
from apps.inventory import services


User = get_user_model()


class InventoryServicesTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="inventory@example.com",
            password="TestPassword123!",
            role="manager",
        )

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

    def create_stock(
        self,
        warehouse=None,
        quantity_on_hand="100.000",
        quantity_reserved="0.000",
    ):
        return StockLevel.objects.create(
            warehouse=warehouse or self.warehouse,
            product_variant=self.variant,
            quantity_on_hand=Decimal(quantity_on_hand),
            quantity_reserved=Decimal(quantity_reserved),
        )

    # ---------------------------------------------------------
    # get_or_create_stock_level
    # ---------------------------------------------------------

    def test_get_or_create_stock_level_creates_stock(self):
        stock = services.get_or_create_stock_level(
            warehouse=self.warehouse,
            product_variant=self.variant,
        )

        self.assertTrue(
            StockLevel.objects.filter(pk=stock.pk).exists()
        )
        self.assertEqual(
            stock.quantity_on_hand,
            Decimal("0.000"),
        )

    def test_get_or_create_stock_level_returns_existing_stock(self):
        existing_stock = self.create_stock()

        stock = services.get_or_create_stock_level(
            warehouse=self.warehouse,
            product_variant=self.variant,
        )

        self.assertEqual(stock.pk, existing_stock.pk)
        self.assertEqual(
            StockLevel.objects.filter(
                warehouse=self.warehouse,
                product_variant=self.variant,
            ).count(),
            1,
        )

    # ---------------------------------------------------------
    # receive_stock
    # ---------------------------------------------------------

    def test_receive_stock_creates_stock_and_movement(self):
        movement = services.receive_stock(
            warehouse=self.warehouse,
            product_variant=self.variant,
            quantity=Decimal("50.000"),
            user=self.user,
            unit_cost=Decimal("35000.00"),
            reference="PUR-001",
            reason="Initial stock receipt",
        )

        stock = StockLevel.objects.get(
            warehouse=self.warehouse,
            product_variant=self.variant,
        )

        self.assertEqual(
            stock.quantity_on_hand,
            Decimal("50.000"),
        )
        self.assertEqual(
            movement.movement_type,
            StockMovement.MovementType.RECEIPT,
        )
        self.assertEqual(movement.to_warehouse, self.warehouse)
        self.assertIsNone(movement.from_warehouse)
        self.assertEqual(
            movement.quantity,
            Decimal("50.000"),
        )
        self.assertEqual(
            movement.unit_cost,
            Decimal("35000.00"),
        )
        self.assertEqual(movement.reference, "PUR-001")
        self.assertEqual(movement.reason, "Initial stock receipt")
        self.assertEqual(movement.performed_by, self.user)
        self.assertTrue(movement.movement_number.startswith("STK-"))

    def test_receive_stock_increases_existing_stock(self):
        stock = self.create_stock(quantity_on_hand="100.000")

        services.receive_stock(
            warehouse=self.warehouse,
            product_variant=self.variant,
            quantity=Decimal("25.000"),
            user=self.user,
        )

        stock.refresh_from_db()

        self.assertEqual(
            stock.quantity_on_hand,
            Decimal("125.000"),
        )

    def test_receive_stock_rejects_zero_quantity(self):
        with self.assertRaises(ValidationError):
            services.receive_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("0.000"),
                user=self.user,
            )

    def test_receive_stock_rejects_negative_quantity(self):
        with self.assertRaises(ValidationError):
            services.receive_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("-5.000"),
                user=self.user,
            )

    def test_receive_stock_rejects_inactive_warehouse(self):
        self.warehouse.status = Warehouse.Status.INACTIVE
        self.warehouse.save(update_fields=["status"])

        with self.assertRaises(ValidationError):
            services.receive_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("10.000"),
                user=self.user,
            )

        self.assertFalse(
            StockLevel.objects.filter(
                warehouse=self.warehouse,
                product_variant=self.variant,
            ).exists()
        )

    # ---------------------------------------------------------
    # issue_stock
    # ---------------------------------------------------------

    def test_issue_stock_decreases_quantity_and_creates_movement(self):
        stock = self.create_stock(quantity_on_hand="100.000")

        movement = services.issue_stock(
            warehouse=self.warehouse,
            product_variant=self.variant,
            quantity=Decimal("30.000"),
            user=self.user,
            reference="SALE-001",
            reason="Customer order",
        )

        stock.refresh_from_db()

        self.assertEqual(
            stock.quantity_on_hand,
            Decimal("70.000"),
        )
        self.assertEqual(
            movement.movement_type,
            StockMovement.MovementType.ISSUE,
        )
        self.assertEqual(movement.from_warehouse, self.warehouse)
        self.assertIsNone(movement.to_warehouse)
        self.assertEqual(
            movement.quantity,
            Decimal("30.000"),
        )
        self.assertEqual(movement.reference, "SALE-001")
        self.assertEqual(movement.performed_by, self.user)

    def test_issue_stock_rejects_zero_quantity(self):
        self.create_stock()

        with self.assertRaises(ValidationError):
            services.issue_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("0.000"),
                user=self.user,
            )

    def test_issue_stock_rejects_negative_quantity(self):
        self.create_stock()

        with self.assertRaises(ValidationError):
            services.issue_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("-10.000"),
                user=self.user,
            )

    def test_issue_stock_rejects_missing_stock_record(self):
        with self.assertRaises(ValidationError):
            services.issue_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("10.000"),
                user=self.user,
            )

    def test_issue_stock_rejects_insufficient_available_stock(self):
        self.create_stock(
            quantity_on_hand="20.000",
            quantity_reserved="5.000",
        )

        with self.assertRaises(ValidationError):
            services.issue_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("16.000"),
                user=self.user,
            )

    def test_issue_stock_cannot_issue_reserved_quantity(self):
        stock = self.create_stock(
            quantity_on_hand="100.000",
            quantity_reserved="40.000",
        )

        with self.assertRaises(ValidationError):
            services.issue_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("61.000"),
                user=self.user,
            )

        stock.refresh_from_db()

        self.assertEqual(
            stock.quantity_on_hand,
            Decimal("100.000"),
        )

    # ---------------------------------------------------------
    # transfer_stock
    # ---------------------------------------------------------

    def test_transfer_stock_moves_quantity_between_warehouses(self):
        source_stock = self.create_stock(
            quantity_on_hand="100.000",
        )

        movement = services.transfer_stock(
            source_warehouse=self.warehouse,
            destination_warehouse=self.second_warehouse,
            product_variant=self.variant,
            quantity=Decimal("30.000"),
            user=self.user,
            reference="TRANSFER-001",
            reason="Warehouse replenishment",
        )

        source_stock.refresh_from_db()

        destination_stock = StockLevel.objects.get(
            warehouse=self.second_warehouse,
            product_variant=self.variant,
        )

        self.assertEqual(
            source_stock.quantity_on_hand,
            Decimal("70.000"),
        )
        self.assertEqual(
            destination_stock.quantity_on_hand,
            Decimal("30.000"),
        )
        self.assertEqual(
            movement.movement_type,
            StockMovement.MovementType.TRANSFER,
        )
        self.assertEqual(movement.from_warehouse, self.warehouse)
        self.assertEqual(movement.to_warehouse, self.second_warehouse)
        self.assertEqual(
            movement.quantity,
            Decimal("30.000"),
        )
        self.assertEqual(movement.reference, "TRANSFER-001")
        self.assertEqual(movement.performed_by, self.user)

    def test_transfer_stock_rejects_zero_quantity(self):
        self.create_stock()

        with self.assertRaises(ValidationError):
            services.transfer_stock(
                source_warehouse=self.warehouse,
                destination_warehouse=self.second_warehouse,
                product_variant=self.variant,
                quantity=Decimal("0.000"),
                user=self.user,
            )

    def test_transfer_stock_rejects_negative_quantity(self):
        self.create_stock()

        with self.assertRaises(ValidationError):
            services.transfer_stock(
                source_warehouse=self.warehouse,
                destination_warehouse=self.second_warehouse,
                product_variant=self.variant,
                quantity=Decimal("-10.000"),
                user=self.user,
            )

    def test_transfer_stock_rejects_same_warehouse(self):
        self.create_stock()

        with self.assertRaises(ValidationError):
            services.transfer_stock(
                source_warehouse=self.warehouse,
                destination_warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("10.000"),
                user=self.user,
            )

    def test_transfer_stock_rejects_missing_source_stock(self):
        with self.assertRaises(ValidationError):
            services.transfer_stock(
                source_warehouse=self.warehouse,
                destination_warehouse=self.second_warehouse,
                product_variant=self.variant,
                quantity=Decimal("10.000"),
                user=self.user,
            )

    def test_transfer_stock_rejects_insufficient_available_stock(self):
        self.create_stock(
            quantity_on_hand="20.000",
            quantity_reserved="10.000",
        )

        with self.assertRaises(ValidationError):
            services.transfer_stock(
                source_warehouse=self.warehouse,
                destination_warehouse=self.second_warehouse,
                product_variant=self.variant,
                quantity=Decimal("11.000"),
                user=self.user,
            )

    def test_transfer_stock_rejects_inactive_source_warehouse(self):
        self.create_stock()

        self.warehouse.status = Warehouse.Status.INACTIVE
        self.warehouse.save(update_fields=["status"])

        with self.assertRaises(ValidationError):
            services.transfer_stock(
                source_warehouse=self.warehouse,
                destination_warehouse=self.second_warehouse,
                product_variant=self.variant,
                quantity=Decimal("10.000"),
                user=self.user,
            )

    def test_transfer_stock_rejects_inactive_destination_warehouse(self):
        self.create_stock()

        self.second_warehouse.status = Warehouse.Status.INACTIVE
        self.second_warehouse.save(update_fields=["status"])

        with self.assertRaises(ValidationError):
            services.transfer_stock(
                source_warehouse=self.warehouse,
                destination_warehouse=self.second_warehouse,
                product_variant=self.variant,
                quantity=Decimal("10.000"),
                user=self.user,
            )

    # ---------------------------------------------------------
    # reserve_stock
    # ---------------------------------------------------------

    def test_reserve_stock_increases_reserved_quantity(self):
        stock = self.create_stock(quantity_on_hand="100.000")

        result = services.reserve_stock(
            warehouse=self.warehouse,
            product_variant=self.variant,
            quantity=Decimal("30.000"),
        )

        stock.refresh_from_db()

        self.assertEqual(
            result.quantity_reserved,
            Decimal("30.000"),
        )
        self.assertEqual(
            stock.quantity_reserved,
            Decimal("30.000"),
        )
        self.assertEqual(
            stock.quantity_on_hand,
            Decimal("100.000"),
        )

    def test_reserve_stock_rejects_zero_quantity(self):
        self.create_stock()

        with self.assertRaises(ValidationError):
            services.reserve_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("0.000"),
            )

    def test_reserve_stock_rejects_negative_quantity(self):
        self.create_stock()

        with self.assertRaises(ValidationError):
            services.reserve_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("-5.000"),
            )

    def test_reserve_stock_rejects_missing_stock(self):
        with self.assertRaises(ValidationError):
            services.reserve_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("10.000"),
            )

    def test_reserve_stock_rejects_insufficient_available_stock(self):
        self.create_stock(
            quantity_on_hand="20.000",
            quantity_reserved="10.000",
        )

        with self.assertRaises(ValidationError):
            services.reserve_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("11.000"),
            )

    # ---------------------------------------------------------
    # release_reserved_stock
    # ---------------------------------------------------------

    def test_release_reserved_stock_decreases_reserved_quantity(self):
        stock = self.create_stock(
            quantity_on_hand="100.000",
            quantity_reserved="40.000",
        )

        result = services.release_reserved_stock(
            warehouse=self.warehouse,
            product_variant=self.variant,
            quantity=Decimal("15.000"),
        )

        stock.refresh_from_db()

        self.assertEqual(
            result.quantity_reserved,
            Decimal("25.000"),
        )
        self.assertEqual(
            stock.quantity_reserved,
            Decimal("25.000"),
        )
        self.assertEqual(
            stock.quantity_on_hand,
            Decimal("100.000"),
        )

    def test_release_reserved_stock_rejects_zero_quantity(self):
        self.create_stock(
            quantity_on_hand="100.000",
            quantity_reserved="20.000",
        )

        with self.assertRaises(ValidationError):
            services.release_reserved_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("0.000"),
            )

    def test_release_reserved_stock_rejects_negative_quantity(self):
        self.create_stock(
            quantity_on_hand="100.000",
            quantity_reserved="20.000",
        )

        with self.assertRaises(ValidationError):
            services.release_reserved_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("-5.000"),
            )

    def test_release_reserved_stock_rejects_missing_stock(self):
        with self.assertRaises(ValidationError):
            services.release_reserved_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("10.000"),
            )

    def test_release_reserved_stock_rejects_excess_quantity(self):
        self.create_stock(
            quantity_on_hand="100.000",
            quantity_reserved="10.000",
        )

        with self.assertRaises(ValidationError):
            services.release_reserved_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("15.000"),
            )

    # ---------------------------------------------------------
    # issue_reserved_stock
    # ---------------------------------------------------------

    def test_issue_reserved_stock_decreases_on_hand_and_reserved(self):
        stock = self.create_stock(
            quantity_on_hand="100.000",
            quantity_reserved="40.000",
        )

        movement = services.issue_reserved_stock(
            warehouse=self.warehouse,
            product_variant=self.variant,
            quantity=Decimal("15.000"),
            user=self.user,
            reference="SALE-RES-001",
            reason="Reserved customer order fulfilled",
        )

        stock.refresh_from_db()

        self.assertEqual(
            stock.quantity_on_hand,
            Decimal("85.000"),
        )
        self.assertEqual(
            stock.quantity_reserved,
            Decimal("25.000"),
        )
        self.assertEqual(
            movement.movement_type,
            StockMovement.MovementType.ISSUE,
        )
        self.assertEqual(movement.from_warehouse, self.warehouse)
        self.assertEqual(
            movement.quantity,
            Decimal("15.000"),
        )
        self.assertEqual(movement.reference, "SALE-RES-001")
        self.assertEqual(
            movement.reason,
            "Reserved customer order fulfilled",
        )
        self.assertEqual(movement.performed_by, self.user)

    def test_issue_reserved_stock_uses_default_reason_when_blank(self):
        self.create_stock(
            quantity_on_hand="100.000",
            quantity_reserved="20.000",
        )

        movement = services.issue_reserved_stock(
            warehouse=self.warehouse,
            product_variant=self.variant,
            quantity=Decimal("10.000"),
            user=self.user,
        )

        self.assertEqual(
            movement.reason,
            "Fulfilled reserved stock.",
        )

    def test_issue_reserved_stock_rejects_zero_quantity(self):
        self.create_stock(
            quantity_on_hand="100.000",
            quantity_reserved="20.000",
        )

        with self.assertRaises(ValidationError):
            services.issue_reserved_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("0.000"),
                user=self.user,
            )

    def test_issue_reserved_stock_rejects_negative_quantity(self):
        self.create_stock(
            quantity_on_hand="100.000",
            quantity_reserved="20.000",
        )

        with self.assertRaises(ValidationError):
            services.issue_reserved_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("-5.000"),
                user=self.user,
            )

    def test_issue_reserved_stock_rejects_missing_stock(self):
        with self.assertRaises(ValidationError):
            services.issue_reserved_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("10.000"),
                user=self.user,
            )

    def test_issue_reserved_stock_rejects_insufficient_reserved_quantity(self):
        self.create_stock(
            quantity_on_hand="100.000",
            quantity_reserved="10.000",
        )

        with self.assertRaises(ValidationError):
            services.issue_reserved_stock(
                warehouse=self.warehouse,
                product_variant=self.variant,
                quantity=Decimal("15.000"),
                user=self.user,
            )
