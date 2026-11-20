from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from apps.catalog.models import ProductVariant

from .models import (
    PurchaseRequest,
    PurchaseRequestItem,
    PurchaseOrder,
    PurchaseOrderItem,
    GoodsReceipt,
    GoodsReceiptItem,
)


# ---------------------------------------------------------------------------
# Lazy related fields (avoid circular imports between apps)
# ---------------------------------------------------------------------------

class ActiveSupplierField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        from apps.suppliers.models import Supplier

        return Supplier.objects.filter(status=Supplier.Status.ACTIVE)


class ActiveWarehouseField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        from apps.inventory.models import Warehouse

        return Warehouse.objects.filter(status=Warehouse.Status.ACTIVE)


# ---------------------------------------------------------------------------
# Purchase requests
# ---------------------------------------------------------------------------

class PurchaseRequestItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product_variant.product.name",
        read_only=True,
    )

    variant_name = serializers.CharField(
        source="product_variant.name",
        read_only=True,
    )

    sku = serializers.CharField(
        source="product_variant.sku",
        read_only=True,
    )

    class Meta:
        model = PurchaseRequestItem
        fields = "__all__"
        read_only_fields = ("id",)


class PurchaseRequestSerializer(serializers.ModelSerializer):

    items = PurchaseRequestItemSerializer(
        many=True,
        read_only=True,
    )

    requested_by_name = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseRequest
        fields = "__all__"

        read_only_fields = (
            "id",
            "request_number",
            "requested_by",
            "approved_by",
            "approved_at",
            "rejection_reason",
            "created_at",
            "updated_at",
        )

    def get_requested_by_name(self, obj):
        return obj.requested_by.get_full_name()

    def validate_required_date(self, value):
        from django.utils import timezone

        if value and value < timezone.localdate():
            raise serializers.ValidationError(
                "Required date cannot be in the past."
            )

        return value


class PurchaseRequestCreateItemSerializer(serializers.Serializer):

    product_variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.filter(is_active=True),
    )

    quantity = serializers.IntegerField(min_value=1)

    notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )


class PurchaseRequestCreateSerializer(serializers.Serializer):

    department = serializers.CharField(max_length=120)

    reason = serializers.CharField()

    required_date = serializers.DateField(
        required=False,
        allow_null=True,
    )

    items = PurchaseRequestCreateItemSerializer(
        many=True,
        allow_empty=False,
    )

    def create(self, validated_data):
        items = validated_data.pop("items")

        with transaction.atomic():
            request = PurchaseRequest.objects.create(
                **validated_data,
                requested_by=self.context["request"].user,
            )

            PurchaseRequestItem.objects.bulk_create([
                PurchaseRequestItem(
                    purchase_request=request,
                    **item,
                )
                for item in items
            ])

        return request


# ---------------------------------------------------------------------------
# Purchase orders
# ---------------------------------------------------------------------------

class PurchaseOrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product_variant.product.name",
        read_only=True,
    )

    variant_name = serializers.CharField(
        source="product_variant.name",
        read_only=True,
    )

    sku = serializers.CharField(
        source="product_variant.sku",
        read_only=True,
    )

    quantity_outstanding = serializers.IntegerField(
        read_only=True,
    )

    class Meta:
        model = PurchaseOrderItem
        fields = "__all__"

        read_only_fields = (
            "id",
            "quantity_received",
            "line_total",
        )


class PurchaseOrderSerializer(serializers.ModelSerializer):

    items = PurchaseOrderItemSerializer(
        many=True,
        read_only=True,
    )

    supplier_name = serializers.CharField(
        source="supplier.name",
        read_only=True,
    )

    warehouse_name = serializers.CharField(
        source="warehouse.name",
        read_only=True,
    )

    class Meta:
        model = PurchaseOrder
        fields = "__all__"

        read_only_fields = (
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
        )


class PurchaseOrderItemCreateSerializer(serializers.Serializer):

    product_variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.filter(is_active=True),
    )

    description = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    quantity_ordered = serializers.IntegerField(
        min_value=1,
    )

    unit_cost = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        min_value=Decimal("0.01"),
    )

    tax_rate = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        min_value=Decimal("0"),
        max_value=Decimal("100"),
        default=Decimal("0"),
    )


class PurchaseOrderCreateSerializer(serializers.Serializer):

    supplier = ActiveSupplierField()

    warehouse = ActiveWarehouseField()

    purchase_request = serializers.PrimaryKeyRelatedField(
        queryset=PurchaseRequest.objects.all(),
        required=False,
        allow_null=True,
    )

    order_date = serializers.DateField()

    expected_delivery_date = serializers.DateField(
        required=False,
        allow_null=True,
    )

    currency = serializers.CharField(
        max_length=3,
        default="RWF",
    )

    notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    items = PurchaseOrderItemCreateSerializer(
        many=True,
        allow_empty=False,
    )

    def validate(self, attrs):
        delivery_date = attrs.get("expected_delivery_date")
        order_date = attrs.get("order_date")

        if delivery_date and delivery_date < order_date:
            raise serializers.ValidationError({
                "expected_delivery_date":
                    "Expected delivery cannot be before the order date."
            })

        return attrs


# ---------------------------------------------------------------------------
# Goods receipts
# ---------------------------------------------------------------------------

class GoodsReceiptItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="purchase_order_item.product_variant.product.name",
        read_only=True,
    )

    sku = serializers.CharField(
        source="purchase_order_item.product_variant.sku",
        read_only=True,
    )

    class Meta:
        model = GoodsReceiptItem
        fields = "__all__"
        read_only_fields = ("id",)


class GoodsReceiptSerializer(serializers.ModelSerializer):

    items = GoodsReceiptItemSerializer(
        many=True,
        read_only=True,
    )

    purchase_order_number = serializers.CharField(
        source="purchase_order.purchase_order_number",
        read_only=True,
    )

    class Meta:
        model = GoodsReceipt
        fields = "__all__"

        read_only_fields = (
            "id",
            "receipt_number",
            "received_by",
            "confirmed_at",
            "created_at",
        )


class GoodsReceiptItemCreateSerializer(serializers.Serializer):

    purchase_order_item = serializers.PrimaryKeyRelatedField(
        queryset=PurchaseOrderItem.objects.all(),
    )

    quantity_received = serializers.IntegerField(
        min_value=1,
    )

    quantity_rejected = serializers.IntegerField(
        min_value=0,
        default=0,
    )

    rejection_reason = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    def validate(self, attrs):
        rejected = attrs.get("quantity_rejected", 0)
        received = attrs["quantity_received"]

        if rejected > received:
            raise serializers.ValidationError(
                "Rejected quantity cannot exceed received quantity."
            )

        if rejected and not attrs.get("rejection_reason"):
            raise serializers.ValidationError({
                "rejection_reason":
                    "A reason is required for rejected goods."
            })

        return attrs


class GoodsReceiptCreateSerializer(serializers.Serializer):

    purchase_order = serializers.PrimaryKeyRelatedField(
        queryset=PurchaseOrder.objects.all(),
    )

    received_date = serializers.DateField()

    supplier_delivery_note = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    items = GoodsReceiptItemCreateSerializer(
        many=True,
        allow_empty=False,
    )

    def validate_items(self, items):
        item_ids = [
            item["purchase_order_item"].pk
            for item in items
        ]

        if len(item_ids) != len(set(item_ids)):
            raise serializers.ValidationError(
                "A purchase order item can only appear once per receipt."
            )

        return items

    def validate(self, attrs):
        purchase_order = attrs["purchase_order"]

        for item in attrs["items"]:
            po_item = item["purchase_order_item"]

            if po_item.purchase_order_id != purchase_order.pk:
                raise serializers.ValidationError({
                    "items":
                        "Every received item must belong to the selected purchase order."
                })

        return attrs