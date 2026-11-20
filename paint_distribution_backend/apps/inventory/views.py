from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from apps.catalog.models import ProductVariant

from apps.inventory.models import (
    Warehouse,
    StockLevel,
    StockMovement,
)

from apps.inventory.serializers import (
    WarehouseSerializer,
    StockLevelSerializer,
    StockMovementSerializer,
    StockOperationSerializer,
)

from apps.inventory.permissions import (
    IsInventoryStaffOrReadOnly,
    IsInventoryManager,
)

from apps.inventory.filters import (
    StockLevelFilter,
    StockMovementFilter,
)

from apps.inventory import services


def run_stock_service(function, **kwargs):
    try:
        return function(**kwargs)
    except DjangoValidationError as exc:
        raise ValidationError(exc.messages)


class WarehouseViewSet(viewsets.ModelViewSet):

    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsInventoryStaffOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ["status", "is_default"]
    search_fields = [
        "name",
        "code",
        "district",
        "province",
    ]

    ordering_fields = ["name", "created_at"]
    ordering = ["name"]


class StockLevelViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = StockLevel.objects.select_related(
        "warehouse",
        "product_variant",
        "product_variant__product",
    )

    serializer_class = StockLevelSerializer
    permission_classes = [IsInventoryStaffOrReadOnly]
    filterset_class = StockLevelFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "product_variant__sku",
        "product_variant__product__name",
        "warehouse__name",
        "warehouse__code",
    ]

    ordering_fields = [
        "quantity_on_hand",
        "quantity_reserved",
        "reorder_level",
        "created_at",
    ]

    ordering = ["warehouse__name"]


class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = StockMovement.objects.select_related(
        "product_variant",
        "product_variant__product",
        "from_warehouse",
        "to_warehouse",
        "performed_by",
    )

    serializer_class = StockMovementSerializer
    permission_classes = [IsInventoryStaffOrReadOnly]
    filterset_class = StockMovementFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "movement_number",
        "reference",
        "reason",
        "product_variant__sku",
        "product_variant__product__name",
    ]

    ordering_fields = ["created_at", "quantity", "movement_type"]
    ordering = ["-created_at"]


class StockOperationViewSet(viewsets.ViewSet):

    permission_classes = [IsInventoryManager]

    @action(detail=False, methods=["post"])
    def receive(self, request):
        return self.execute_operation(request, "RECEIPT")

    @action(detail=False, methods=["post"])
    def issue(self, request):
        return self.execute_operation(request, "ISSUE")

    @action(detail=False, methods=["post"])
    def transfer(self, request):
        return self.execute_operation(request, "TRANSFER")

    def execute_operation(self, request, expected_operation):
        serializer = StockOperationSerializer(data={
            **request.data,
            "operation": expected_operation,
        })

        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            product_variant = ProductVariant.objects.get(
                pk=data["product_variant"],
            )

            if expected_operation == "RECEIPT":
                warehouse = Warehouse.objects.get(
                    pk=data["to_warehouse"],
                )

                movement = services.receive_stock(
                    warehouse=warehouse,
                    product_variant=product_variant,
                    quantity=data["quantity"],
                    user=request.user,
                    unit_cost=data.get("unit_cost"),
                    reference=data.get("reference", ""),
                    reason=data.get("reason", ""),
                )

            elif expected_operation == "ISSUE":
                warehouse = Warehouse.objects.get(
                    pk=data["from_warehouse"],
                )

                movement = services.issue_stock(
                    warehouse=warehouse,
                    product_variant=product_variant,
                    quantity=data["quantity"],
                    user=request.user,
                    reference=data.get("reference", ""),
                    reason=data.get("reason", ""),
                )

            else:
                source = Warehouse.objects.get(
                    pk=data["from_warehouse"],
                )

                destination = Warehouse.objects.get(
                    pk=data["to_warehouse"],
                )

                movement = services.transfer_stock(
                    source_warehouse=source,
                    destination_warehouse=destination,
                    product_variant=product_variant,
                    quantity=data["quantity"],
                    user=request.user,
                    reference=data.get("reference", ""),
                    reason=data.get("reason", ""),
                )

        except (
            ProductVariant.DoesNotExist,
            Warehouse.DoesNotExist,
        ):
            raise ValidationError(
                "The selected product variant or warehouse does not exist."
            )

        except DjangoValidationError as exc:
            raise ValidationError(exc.messages)

        return Response(
            StockMovementSerializer(movement).data,
            status=status.HTTP_201_CREATED,
        )