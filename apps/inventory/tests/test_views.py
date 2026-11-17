
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.catalog.models import Category, Product, ProductVariant
from apps.inventory.models import Warehouse, StockLevel, StockMovement


User = get_user_model()


class InventoryAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.manager = User.objects.create_user(
            email="manager@example.com",
            password="TestPassword123!",
            role="manager",
        )

        self.regular_user = User.objects.create_user(
            email="sales@example.com",
            password="TestPassword123!",
            role="sales_person",
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

        self.second_warehouse = Warehouse.objects.create(
            name="Huye Warehouse",
            code="HYE-001",
        )

        self.client.force_authenticate(user=self.manager)

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

    def get_results(self, response):
        if isinstance(response.data, dict) and "results" in response.data:
            return response.data["results"]

        return response.data

    # ---------------------------------------------------------
    # Authentication and permissions
    # ---------------------------------------------------------

    def test_unauthenticated_user_cannot_list_warehouses(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(reverse("warehouses-list"))

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_authenticated_user_can_list_warehouses(self):
        self.client.force_authenticate(user=self.regular_user)

        response = self.client.get(reverse("warehouses-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_regular_user_cannot_create_warehouse(self):
        self.client.force_authenticate(user=self.regular_user)

        response = self.client.post(
            reverse("warehouses-list"),
            {
                "name": "Rubavu Warehouse",
                "code": "RUB-001",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_manager_can_create_warehouse(self):
        response = self.client.post(
            reverse("warehouses-list"),
            {
                "name": "Rubavu Warehouse",
                "code": "RUB-001",
                "country": "Rwanda",
                "province": "Western Province",
                "district": "Rubavu",
                "status": Warehouse.Status.ACTIVE,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertTrue(
            Warehouse.objects.filter(code="RUB-001").exists()
        )

    def test_inactive_user_cannot_access_inventory(self):
        self.regular_user.is_active = False
        self.regular_user.save(update_fields=["is_active"])

        self.client.force_authenticate(user=self.regular_user)

        response = self.client.get(reverse("warehouses-list"))

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    # ---------------------------------------------------------
    # Warehouse endpoints
    # ---------------------------------------------------------

    def test_list_warehouses(self):
        response = self.client.get(reverse("warehouses-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        warehouses = self.get_results(response)

        self.assertTrue(
            any(
                warehouse["code"] == "KGL-001"
                for warehouse in warehouses
            )
        )

    def test_retrieve_warehouse(self):
        response = self.client.get(
            reverse(
                "warehouses-detail",
                kwargs={"pk": self.warehouse.pk},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            "Kigali Warehouse",
        )

    def test_update_warehouse(self):
        response = self.client.patch(
            reverse(
                "warehouses-detail",
                kwargs={"pk": self.warehouse.pk},
            ),
            {
                "name": "Updated Kigali Warehouse",
                "district": "Gasabo",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.warehouse.refresh_from_db()

        self.assertEqual(
            self.warehouse.name,
            "Updated Kigali Warehouse",
        )
        self.assertEqual(self.warehouse.district, "Gasabo")

    def test_delete_warehouse_without_stock(self):
        warehouse = Warehouse.objects.create(
            name="Temporary Warehouse",
            code="TEMP-001",
        )

        response = self.client.delete(
            reverse(
                "warehouses-detail",
                kwargs={"pk": warehouse.pk},
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Warehouse.objects.filter(pk=warehouse.pk).exists()
        )

    def test_search_warehouses(self):
        response = self.client.get(
            reverse("warehouses-list"),
            {"search": "Kigali"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        warehouses = self.get_results(response)

        self.assertTrue(
            any(
                warehouse["name"] == "Kigali Warehouse"
                for warehouse in warehouses
            )
        )

    # ---------------------------------------------------------
    # Stock-level endpoints
    # ---------------------------------------------------------

    def test_list_stock_levels(self):
        self.create_stock()

        response = self.client.get(reverse("stock-levels-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        stock_levels = self.get_results(response)

        self.assertTrue(
            any(
                item["sku"] == "PAINT-001-WHITE-20L"
                for item in stock_levels
            )
        )

    def test_retrieve_stock_level(self):
        stock = self.create_stock()

        response = self.client.get(
            reverse(
                "stock-levels-detail",
                kwargs={"pk": stock.pk},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["warehouse_name"],
            "Kigali Warehouse",
        )
        self.assertEqual(
            response.data["product_name"],
            "Premium Interior Paint",
        )

    def test_regular_user_can_view_stock_levels(self):
        self.create_stock()

        self.client.force_authenticate(user=self.regular_user)

        response = self.client.get(reverse("stock-levels-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_stock_levels_are_read_only(self):
        stock = self.create_stock()

        response = self.client.post(
            reverse("stock-levels-list"),
            {
                "warehouse": str(self.warehouse.pk),
                "product_variant": str(self.variant.pk),
                "quantity_on_hand": "100.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

        self.assertTrue(
            StockLevel.objects.filter(pk=stock.pk).exists()
        )

    # ---------------------------------------------------------
    # Stock-movement endpoints
    # ---------------------------------------------------------

    def test_list_stock_movements(self):
        self.client.post(
            reverse("stock-operations-receive"),
            {
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "50.000",
                "unit_cost": "35000.00",
                "reference": "PUR-001",
            },
            format="json",
        )

        response = self.client.get(reverse("stock-movements-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        movements = self.get_results(response)

        self.assertTrue(
            any(
                movement["movement_type"] == "RECEIPT"
                for movement in movements
            )
        )

    def test_retrieve_stock_movement(self):
        operation_response = self.client.post(
            reverse("stock-operations-receive"),
            {
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "50.000",
            },
            format="json",
        )

        movement_id = operation_response.data["id"]

        response = self.client.get(
            reverse(
                "stock-movements-detail",
                kwargs={"pk": movement_id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["movement_type"],
            StockMovement.MovementType.RECEIPT,
        )

    def test_regular_user_can_view_stock_movements(self):
        self.client.post(
            reverse("stock-operations-receive"),
            {
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "20.000",
            },
            format="json",
        )

        self.client.force_authenticate(user=self.regular_user)

        response = self.client.get(reverse("stock-movements-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_stock_movements_are_read_only(self):
        response = self.client.post(
            reverse("stock-movements-list"),
            {
                "movement_number": "STK-MANUAL",
                "product_variant": str(self.variant.pk),
                "movement_type": "RECEIPT",
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "10.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    # ---------------------------------------------------------
    # Stock operation permissions
    # ---------------------------------------------------------

    def test_regular_user_cannot_receive_stock(self):
        self.client.force_authenticate(user=self.regular_user)

        response = self.client.post(
            reverse("stock-operations-receive"),
            {
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "20.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_regular_user_cannot_issue_stock(self):
        self.create_stock()

        self.client.force_authenticate(user=self.regular_user)

        response = self.client.post(
            reverse("stock-operations-issue"),
            {
                "product_variant": str(self.variant.pk),
                "from_warehouse": str(self.warehouse.pk),
                "quantity": "10.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_regular_user_cannot_transfer_stock(self):
        self.create_stock()

        self.client.force_authenticate(user=self.regular_user)

        response = self.client.post(
            reverse("stock-operations-transfer"),
            {
                "product_variant": str(self.variant.pk),
                "from_warehouse": str(self.warehouse.pk),
                "to_warehouse": str(self.second_warehouse.pk),
                "quantity": "10.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    # ---------------------------------------------------------
    # Receive stock endpoint
    # ---------------------------------------------------------

    def test_receive_stock_endpoint(self):
        response = self.client.post(
            reverse("stock-operations-receive"),
            {
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "50.000",
                "unit_cost": "35000.00",
                "reference": "PUR-001",
                "reason": "New stock received",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            response.data["movement_type"],
            StockMovement.MovementType.RECEIPT,
        )

        stock = StockLevel.objects.get(
            warehouse=self.warehouse,
            product_variant=self.variant,
        )

        self.assertEqual(
            stock.quantity_on_hand,
            Decimal("50.000"),
        )

    def test_receive_stock_requires_destination_warehouse(self):
        response = self.client.post(
            reverse("stock-operations-receive"),
            {
                "product_variant": str(self.variant.pk),
                "quantity": "20.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("to_warehouse", response.data)

    def test_receive_stock_rejects_inactive_warehouse(self):
        self.warehouse.status = Warehouse.Status.INACTIVE
        self.warehouse.save(update_fields=["status"])

        response = self.client.post(
            reverse("stock-operations-receive"),
            {
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "20.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    # ---------------------------------------------------------
    # Issue stock endpoint
    # ---------------------------------------------------------

    def test_issue_stock_endpoint(self):
        self.create_stock(quantity_on_hand="100.000")

        response = self.client.post(
            reverse("stock-operations-issue"),
            {
                "product_variant": str(self.variant.pk),
                "from_warehouse": str(self.warehouse.pk),
                "quantity": "30.000",
                "reference": "SALE-001",
                "reason": "Customer order",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            response.data["movement_type"],
            StockMovement.MovementType.ISSUE,
        )

        stock = StockLevel.objects.get(
            warehouse=self.warehouse,
            product_variant=self.variant,
        )

        self.assertEqual(
            stock.quantity_on_hand,
            Decimal("70.000"),
        )

    def test_issue_stock_requires_source_warehouse(self):
        response = self.client.post(
            reverse("stock-operations-issue"),
            {
                "product_variant": str(self.variant.pk),
                "quantity": "10.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("from_warehouse", response.data)

    def test_issue_stock_rejects_insufficient_stock(self):
        self.create_stock(
            quantity_on_hand="10.000",
        )

        response = self.client.post(
            reverse("stock-operations-issue"),
            {
                "product_variant": str(self.variant.pk),
                "from_warehouse": str(self.warehouse.pk),
                "quantity": "20.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        stock = StockLevel.objects.get(
            warehouse=self.warehouse,
            product_variant=self.variant,
        )

        self.assertEqual(
            stock.quantity_on_hand,
            Decimal("10.000"),
        )

    # ---------------------------------------------------------
    # Transfer stock endpoint
    # ---------------------------------------------------------

    def test_transfer_stock_endpoint(self):
        self.create_stock(quantity_on_hand="100.000")

        response = self.client.post(
            reverse("stock-operations-transfer"),
            {
                "product_variant": str(self.variant.pk),
                "from_warehouse": str(self.warehouse.pk),
                "to_warehouse": str(self.second_warehouse.pk),
                "quantity": "40.000",
                "reference": "TRANSFER-001",
                "reason": "Warehouse replenishment",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            response.data["movement_type"],
            StockMovement.MovementType.TRANSFER,
        )

        source_stock = StockLevel.objects.get(
            warehouse=self.warehouse,
            product_variant=self.variant,
        )

        destination_stock = StockLevel.objects.get(
            warehouse=self.second_warehouse,
            product_variant=self.variant,
        )

        self.assertEqual(
            source_stock.quantity_on_hand,
            Decimal("60.000"),
        )
        self.assertEqual(
            destination_stock.quantity_on_hand,
            Decimal("40.000"),
        )

    def test_transfer_requires_both_warehouses(self):
        response = self.client.post(
            reverse("stock-operations-transfer"),
            {
                "product_variant": str(self.variant.pk),
                "from_warehouse": str(self.warehouse.pk),
                "quantity": "10.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_transfer_rejects_same_warehouse(self):
        self.create_stock()

        response = self.client.post(
            reverse("stock-operations-transfer"),
            {
                "product_variant": str(self.variant.pk),
                "from_warehouse": str(self.warehouse.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "10.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("to_warehouse", response.data)

    # ---------------------------------------------------------
    # Invalid operation references and quantities
    # ---------------------------------------------------------

    def test_receive_rejects_nonexistent_product_variant(self):
        import uuid

        response = self.client.post(
            reverse("stock-operations-receive"),
            {
                "product_variant": str(uuid.uuid4()),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "10.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_receive_rejects_nonexistent_warehouse(self):
        import uuid

        response = self.client.post(
            reverse("stock-operations-receive"),
            {
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(uuid.uuid4()),
                "quantity": "10.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_receive_rejects_zero_quantity(self):
        response = self.client.post(
            reverse("stock-operations-receive"),
            {
                "product_variant": str(self.variant.pk),
                "to_warehouse": str(self.warehouse.pk),
                "quantity": "0.000",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("quantity", response.data)
