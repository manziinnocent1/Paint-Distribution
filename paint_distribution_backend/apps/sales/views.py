
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from .models import (
    SalesQuotation,
    Sale,
    SaleItem,
    SalesReturn,
)

from .serializers import (
    SalesQuotationSerializer,
    SalesQuotationCreateSerializer,
    SaleSerializer,
    SaleCreateSerializer,
    SalesReturnSerializer,
    SalesReturnCreateSerializer,
)

from .permissions import SalesPermission

from .filters import (
    SalesQuotationFilter,
    SaleFilter,
    SalesReturnFilter,
)

from .services import (
    create_sale,
    confirm_sale,
    fulfill_sale_item,
)


def generate_quotation_number():
    import uuid

    return f"QUO-{uuid.uuid4().hex[:10].upper()}"


class SalesQuotationViewSet(viewsets.ModelViewSet):

    permission_classes = [SalesPermission]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = SalesQuotationFilter

    search_fields = [
        "quotation_number",
        "customer__first_name",
        "customer__last_name",
        "customer__business_name",
    ]

    ordering_fields = [
        "quotation_date",
        "valid_until",
        "total_amount",
        "created_at",
    ]

    ordering = ["-created_at"]

    def get_queryset(self):
        return SalesQuotation.objects.select_related(
            "customer",
            "warehouse",
            "created_by",
        ).prefetch_related(
            "items",
            "items__product_variant",
            "items__product_variant__product",
        )

    def get_serializer_class(self):
        if self.action == "create":
            return SalesQuotationCreateSerializer

        return SalesQuotationSerializer

    def perform_create(self, serializer):
        serializer.save(
            quotation_number=generate_quotation_number(),
        )

    @action(detail=True, methods=["post"])
    def send(self, request, pk=None):
        quotation = self.get_object()

        with transaction.atomic():
            quotation = SalesQuotation.objects.select_for_update().get(
                pk=quotation.pk
            )

            if quotation.status != SalesQuotation.Status.DRAFT:
                raise ValidationError(
                    "Only draft quotations can be sent."
                )

            quotation.status = SalesQuotation.Status.SENT
            quotation.save(
                update_fields=["status", "updated_at"]
            )

        return Response(
            SalesQuotationSerializer(quotation).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        quotation = self.get_object()

        with transaction.atomic():
            quotation = SalesQuotation.objects.select_for_update().get(
                pk=quotation.pk
            )

            if quotation.status != SalesQuotation.Status.SENT:
                raise ValidationError(
                    "Only sent quotations can be accepted."
                )

            if quotation.valid_until < timezone.localdate():
                quotation.status = SalesQuotation.Status.EXPIRED
                quotation.save(
                    update_fields=["status", "updated_at"]
                )

                raise ValidationError(
                    "This quotation has expired."
                )

            quotation.status = SalesQuotation.Status.ACCEPTED
            quotation.save(
                update_fields=["status", "updated_at"]
            )

        return Response(
            SalesQuotationSerializer(quotation).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        quotation = self.get_object()

        with transaction.atomic():
            quotation = SalesQuotation.objects.select_for_update().get(
                pk=quotation.pk
            )

            if quotation.status != SalesQuotation.Status.SENT:
                raise ValidationError(
                    "Only sent quotations can be rejected."
                )

            quotation.status = SalesQuotation.Status.REJECTED
            quotation.save(
                update_fields=["status", "updated_at"]
            )

        return Response(
            SalesQuotationSerializer(quotation).data,
            status=status.HTTP_200_OK,
        )


class SaleViewSet(viewsets.ModelViewSet):

    permission_classes = [SalesPermission]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = SaleFilter

    search_fields = [
        "sale_number",
        "customer__first_name",
        "customer__last_name",
        "customer__business_name",
    ]

    ordering_fields = [
        "sale_date",
        "total_amount",
        "created_at",
        "status",
    ]

    ordering = ["-created_at"]

    def get_queryset(self):
        return Sale.objects.select_related(
            "customer",
            "warehouse",
            "created_by",
            "confirmed_by",
            "quotation",
        ).prefetch_related(
            "items",
            "items__product_variant",
            "items__product_variant__product",
        )

    def get_serializer_class(self):
        if self.action == "create":
            return SaleCreateSerializer

        return SaleSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        items = data.pop("items")

        # Price and tax are read from the catalogue.
        # They are not accepted from the request body.
        prepared_items = []

        for item in items:
            variant = item["product_variant"]

            prepared_items.append({
                "product_variant": variant,
                "quantity": item["quantity"],
                "unit_price": variant.selling_price,
                "discount_amount": item["discount_amount"],
                "tax_rate": variant.product.tax_rate,
            })

        sale = create_sale(
            data=data,
            items=prepared_items,
            user=request.user,
        )

        return Response(
            SaleSerializer(
                sale,
                context=self.get_serializer_context(),
            ).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        try:
            sale = confirm_sale(
                sale_id=pk,
                user=request.user,
            )

        except DjangoValidationError as exc:
            detail = (
                exc.message_dict
                if hasattr(exc, "message_dict")
                else exc.messages
            )

            raise ValidationError(detail) from exc

        return Response(
            SaleSerializer(
                sale,
                context=self.get_serializer_context(),
            ).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="fulfill",
    )
    def fulfill(self, request, pk=None):
        sale = self.get_object()

        sale_item_id = request.data.get("sale_item")
        quantity = request.data.get("quantity")

        if not sale_item_id:
            raise ValidationError({
                "sale_item": "Sale item ID is required."
            })

        if quantity is None:
            raise ValidationError({
                "quantity": "Fulfilment quantity is required."
            })

        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            raise ValidationError({
                "quantity": "Quantity must be a whole number."
            })

        if quantity <= 0:
            raise ValidationError({
                "quantity": "Quantity must be greater than zero."
            })

        sale_item = SaleItem.objects.filter(
            pk=sale_item_id,
            sale=sale,
        ).first()

        if not sale_item:
            raise ValidationError({
                "sale_item": "This item does not belong to this sale."
            })

        fulfill_sale_item(
            sale_item_id=sale_item.pk,
            quantity=quantity,
            user=request.user,
        )

        sale.refresh_from_db()

        return Response({
            "message": "Sale item fulfilled successfully.",
            "sale": SaleSerializer(
                sale,
                context=self.get_serializer_context(),
            ).data,
        }, status=status.HTTP_200_OK)


class SalesReturnViewSet(viewsets.ModelViewSet):

    permission_classes = [SalesPermission]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = SalesReturnFilter

    search_fields = [
        "return_number",
        "sale__sale_number",
        "reason",
    ]

    ordering_fields = [
        "created_at",
        "status",
    ]

    ordering = ["-created_at"]
    
    
    def create(self, request, *args, **kwargs):
        input_serializer = self.get_serializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)

        sales_return = input_serializer.save()

        # Use the read serializer for the API response so that
        # return_number and all model fields are included.
        output_serializer = SalesReturnSerializer(
            sales_return,
            context=self.get_serializer_context(),
        )

        return Response(
            output_serializer.data,
            status=status.HTTP_201_CREATED,
        )


    def get_queryset(self):
        return SalesReturn.objects.select_related(
            "sale",
            "requested_by",
            "approved_by",
        ).prefetch_related(
            "items",
            "items__sale_item",
        )

    def get_serializer_class(self):
        if self.action == "create":
            return SalesReturnCreateSerializer

        return SalesReturnSerializer

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        sales_return = self.get_object()

        with transaction.atomic():
            sales_return = SalesReturn.objects.select_for_update().get(
                pk=sales_return.pk
            )

            if sales_return.status != SalesReturn.Status.DRAFT:
                raise ValidationError(
                    "Only draft returns can be approved."
                )

            sales_return.status = SalesReturn.Status.APPROVED
            sales_return.approved_by = request.user

            sales_return.save(
                update_fields=[
                    "status",
                    "approved_by",
                    "updated_at",
                ]
            )

        return Response(
            SalesReturnSerializer(sales_return).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        sales_return = self.get_object()

        with transaction.atomic():
            sales_return = SalesReturn.objects.select_for_update().get(
                pk=sales_return.pk
            )

            if sales_return.status != SalesReturn.Status.DRAFT:
                raise ValidationError(
                    "Only draft returns can be rejected."
                )

            sales_return.status = SalesReturn.Status.REJECTED
            sales_return.save(
                update_fields=["status", "updated_at"]
            )

        return Response(
            SalesReturnSerializer(sales_return).data,
            status=status.HTTP_200_OK,
        )
