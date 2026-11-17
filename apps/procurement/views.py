from django.db import transaction
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from .models import (
    PurchaseRequest,
    PurchaseOrder,
    GoodsReceipt,
)

from .serializers import (
    PurchaseRequestSerializer,
    PurchaseRequestCreateSerializer,
    PurchaseOrderSerializer,
    PurchaseOrderCreateSerializer,
    GoodsReceiptSerializer,
    GoodsReceiptCreateSerializer,
)

from .permissions import ProcurementPermission
from .filters import (
    PurchaseRequestFilter,
    PurchaseOrderFilter,
    GoodsReceiptFilter,
)

from .services import (
    create_purchase_order,
    approve_purchase_order,
    receive_purchase_order,
)


def generate_request_number():
    import uuid
    return f"PR-{uuid.uuid4().hex[:10].upper()}"


class PurchaseRequestViewSet(viewsets.ModelViewSet):

    permission_classes = [ProcurementPermission]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = PurchaseRequestFilter

    search_fields = [
        "request_number",
        "department",
        "reason",
    ]

    ordering_fields = [
        "created_at",
        "required_date",
        "status",
    ]

    ordering = ["-created_at"]

    def get_queryset(self):
        return PurchaseRequest.objects.select_related(
            "requested_by",
            "approved_by",
        ).prefetch_related(
            "items",
            "items__product_variant",
            "items__product_variant__product",
        )

    def get_serializer_class(self):
        if self.action == "create":
            return PurchaseRequestCreateSerializer

        return PurchaseRequestSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @transaction.atomic
    def perform_create(self, serializer):
        serializer.save(
            request_number=generate_request_number(),
            requested_by=self.request.user,
        )

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        purchase_request = self.get_object()

        with transaction.atomic():
            purchase_request = PurchaseRequest.objects.select_for_update().get(
                pk=purchase_request.pk
            )

            if purchase_request.status != PurchaseRequest.Status.DRAFT:
                raise ValidationError(
                    "Only draft purchase requests can be submitted."
                )

            if not purchase_request.items.exists():
                raise ValidationError(
                    "A purchase request must contain at least one item."
                )

            purchase_request.status = PurchaseRequest.Status.SUBMITTED
            purchase_request.save(
                update_fields=["status", "updated_at"]
            )

        return Response(
            PurchaseRequestSerializer(purchase_request).data
        )

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        purchase_request = self.get_object()

        with transaction.atomic():
            purchase_request = PurchaseRequest.objects.select_for_update().get(
                pk=purchase_request.pk
            )

            if purchase_request.status != PurchaseRequest.Status.SUBMITTED:
                raise ValidationError(
                    "Only submitted purchase requests can be approved."
                )

            purchase_request.status = PurchaseRequest.Status.APPROVED
            purchase_request.approved_by = request.user
            purchase_request.approved_at = timezone.now()

            purchase_request.save(
                update_fields=[
                    "status",
                    "approved_by",
                    "approved_at",
                    "updated_at",
                ]
            )

        return Response(
            PurchaseRequestSerializer(purchase_request).data
        )

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        purchase_request = self.get_object()
        reason = request.data.get("rejection_reason", "").strip()

        if not reason:
            raise ValidationError({
                "rejection_reason": "A rejection reason is required."
            })

        with transaction.atomic():
            purchase_request = PurchaseRequest.objects.select_for_update().get(
                pk=purchase_request.pk
            )

            if purchase_request.status != PurchaseRequest.Status.SUBMITTED:
                raise ValidationError(
                    "Only submitted purchase requests can be rejected."
                )

            purchase_request.status = PurchaseRequest.Status.REJECTED
            purchase_request.rejection_reason = reason
            purchase_request.approved_by = request.user

            purchase_request.save(
                update_fields=[
                    "status",
                    "rejection_reason",
                    "approved_by",
                    "updated_at",
                ]
            )

        return Response(
            PurchaseRequestSerializer(purchase_request).data
        )


class PurchaseOrderViewSet(viewsets.ModelViewSet):

    permission_classes = [ProcurementPermission]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = PurchaseOrderFilter

    search_fields = [
        "purchase_order_number",
        "supplier__name",
        "supplier__supplier_number",
    ]

    ordering_fields = [
        "order_date",
        "expected_delivery_date",
        "total_amount",
        "created_at",
        "status",
    ]

    ordering = ["-created_at"]

    def get_queryset(self):
        return PurchaseOrder.objects.select_related(
            "supplier",
            "warehouse",
            "purchase_request",
            "created_by",
            "approved_by",
        ).prefetch_related(
            "items",
            "items__product_variant",
            "items__product_variant__product",
        )

    def get_serializer_class(self):
        if self.action == "create":
            return PurchaseOrderCreateSerializer

        return PurchaseOrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        items = validated_data.pop("items")

        purchase_order = create_purchase_order(
            data=validated_data,
            items=items,
            user=request.user,
        )

        output = PurchaseOrderSerializer(
            purchase_order,
            context=self.get_serializer_context(),
        )

        return Response(
            output.data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        order = self.get_object()

        with transaction.atomic():
            order = PurchaseOrder.objects.select_for_update().get(
                pk=order.pk
            )

            if order.status != PurchaseOrder.Status.DRAFT:
                raise ValidationError(
                    "Only draft purchase orders can be submitted."
                )

            if not order.items.exists():
                raise ValidationError(
                    "A purchase order must contain at least one item."
                )

            order.status = PurchaseOrder.Status.SUBMITTED
            order.save(update_fields=["status", "updated_at"])

        return Response(PurchaseOrderSerializer(order).data)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        order = approve_purchase_order(
            order_id=pk,
            user=request.user,
        )

        return Response(
            PurchaseOrderSerializer(order).data
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="receive",
    )
    def receive(self, request, pk=None):
        serializer = GoodsReceiptCreateSerializer(
            data={
                **request.data,
                "purchase_order": pk,
            }
        )

        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        receipt_items = data.pop("items")
        data.pop("purchase_order")

        receipt = receive_purchase_order(
            order_id=pk,
            receipt_items=receipt_items,
            user=request.user,
            received_date=data["received_date"],
            supplier_delivery_note=data.get(
                "supplier_delivery_note",
                "",
            ),
            notes=data.get("notes", ""),
        )

        return Response(
            GoodsReceiptSerializer(receipt).data,
            status=status.HTTP_201_CREATED,
        )


class GoodsReceiptViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = GoodsReceiptSerializer
    permission_classes = [ProcurementPermission]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = GoodsReceiptFilter

    search_fields = [
        "receipt_number",
        "supplier_delivery_note",
        "purchase_order__purchase_order_number",
    ]

    ordering_fields = [
        "received_date",
        "created_at",
    ]

    ordering = ["-created_at"]

    def get_queryset(self):
        return GoodsReceipt.objects.select_related(
            "purchase_order",
            "received_by",
        ).prefetch_related(
            "items",
            "items__purchase_order_item",
            "items__purchase_order_item__product_variant",
        )