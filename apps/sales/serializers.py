
import uuid
from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from rest_framework import serializers

from apps.catalog.models import ProductVariant
from apps.customers.models import Customer
from apps.inventory.models import Warehouse

from .models import (
    SalesQuotation,
    SalesQuotationItem,
    Sale,
    SaleItem,
    SalesReturn,
    SalesReturnItem,
)


class SalesQuotationItemSerializer(serializers.ModelSerializer):
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
        model = SalesQuotationItem
        fields = "__all__"
        read_only_fields = ("id", "line_total")


class SalesQuotationSerializer(serializers.ModelSerializer):
    items = SalesQuotationItemSerializer(
        many=True,
        read_only=True,
    )
    customer_name = serializers.SerializerMethodField()
    warehouse_name = serializers.CharField(
        source="warehouse.name",
        read_only=True,
    )

    class Meta:
        model = SalesQuotation
        fields = "__all__"
        read_only_fields = (
            "id",
            "quotation_number",
            "subtotal",
            "discount_amount",
            "tax_amount",
            "total_amount",
            "created_by",
            "created_at",
            "updated_at",
        )

    def get_customer_name(self, obj):
        return str(obj.customer)


class SalesQuotationItemCreateSerializer(serializers.Serializer):
    product_variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.filter(
            is_active=True,
            product__status="ACTIVE",
        ),
    )

    quantity = serializers.IntegerField(min_value=1)

    discount_amount = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        min_value=Decimal("0"),
        default=Decimal("0"),
    )


class SalesQuotationCreateSerializer(serializers.Serializer):
    customer = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.filter(
            status=Customer.Status.ACTIVE,
        ),
    )

    warehouse = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.filter(
            status=Warehouse.Status.ACTIVE,
        ),
    )

    quotation_date = serializers.DateField(
        required=False,
        default=timezone.localdate,
    )
    
    quotation_number = serializers.CharField(read_only=True)

    valid_until = serializers.DateField()

    currency = serializers.CharField(
        max_length=3,
        default="RWF",
    )

    notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    items = SalesQuotationItemCreateSerializer(
        many=True,
        allow_empty=False,
    )

    def validate(self, attrs):
        if attrs["valid_until"] < attrs["quotation_date"]:
            raise serializers.ValidationError({
                "valid_until": (
                    "Quotation expiry cannot be before its quotation date."
                )
            })

        return attrs

    def create(self, validated_data):
        items = validated_data.pop("items")
        user = self.context["request"].user

        with transaction.atomic():
            quotation = SalesQuotation.objects.create(
                **validated_data,
                created_by=user,
            )

            subtotal = Decimal("0.00")
            total_discount = Decimal("0.00")
            total_tax = Decimal("0.00")

            for item in items:
                variant = item["product_variant"]
                quantity = item["quantity"]

                unit_price = variant.selling_price
                discount = item["discount_amount"]

                gross = unit_price * quantity

                if discount > gross:
                    raise serializers.ValidationError({
                        "discount_amount": (
                            "An item discount cannot exceed its gross value."
                        )
                    })

                taxable_amount = gross - discount
                tax_rate = variant.product.tax_rate

                tax = (
                    taxable_amount
                    * tax_rate
                    / Decimal("100")
                )

                line_total = taxable_amount + tax

                SalesQuotationItem.objects.create(
                    quotation=quotation,
                    product_variant=variant,
                    quantity=quantity,
                    unit_price=unit_price,
                    discount_amount=discount,
                    tax_rate=tax_rate,
                    line_total=line_total,
                )

                subtotal += gross
                total_discount += discount
                total_tax += tax

            quotation.subtotal = subtotal
            quotation.discount_amount = total_discount
            quotation.tax_amount = total_tax
            quotation.total_amount = (
                subtotal - total_discount + total_tax
            )

            quotation.save(
                update_fields=[
                    "subtotal",
                    "discount_amount",
                    "tax_amount",
                    "total_amount",
                    "updated_at",
                ]
            )

        return quotation


class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = "__all__"
        read_only_fields = (
            "id",
            "sale",
            "product_name",
            "variant_name",
            "sku",
            "unit_price",
            "discount_amount",
            "tax_rate",
            "line_total",
            "quantity_fulfilled",
        )


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(
        many=True,
        read_only=True,
    )

    customer_name = serializers.SerializerMethodField()

    warehouse_name = serializers.CharField(
        source="warehouse.name",
        read_only=True,
    )

    class Meta:
        model = Sale
        fields = "__all__"
        read_only_fields = (
            "id",
            "sale_number",
            "subtotal",
            "discount_amount",
            "tax_amount",
            "total_amount",
            "created_by",
            "confirmed_by",
            "confirmed_at",
            "created_at",
            "updated_at",
        )

    def get_customer_name(self, obj):
        return str(obj.customer)


class SaleItemCreateSerializer(serializers.Serializer):
    product_variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.filter(
            is_active=True,
            product__status="ACTIVE",
        ),
    )

    quantity = serializers.IntegerField(min_value=1)

    discount_amount = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        min_value=Decimal("0"),
        default=Decimal("0"),
    )


class SaleCreateSerializer(serializers.Serializer):
    customer = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.filter(
            status=Customer.Status.ACTIVE,
        ),
    )

    warehouse = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.filter(
            status=Warehouse.Status.ACTIVE,
        ),
    )

    sales_channel = serializers.ChoiceField(
        choices=Sale.SalesChannel.choices,
        default=Sale.SalesChannel.DIRECT,
    )

    sale_date = serializers.DateField(
        required=False,
        default=timezone.localdate,
    )

    currency = serializers.CharField(
        max_length=3,
        default="RWF",
    )

    notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    items = SaleItemCreateSerializer(
        many=True,
        allow_empty=False,
    )

    def validate(self, attrs):
        for item in attrs["items"]:
            variant = item["product_variant"]

            gross = (
                variant.selling_price
                * item["quantity"]
            )

            if item["discount_amount"] > gross:
                raise serializers.ValidationError({
                    "items": (
                        "An item discount cannot exceed its gross value."
                    )
                })

        return attrs


class SalesReturnItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesReturnItem
        fields = "__all__"
        read_only_fields = ("id",)


class SalesReturnSerializer(serializers.ModelSerializer):
    items = SalesReturnItemSerializer(
        many=True,
        read_only=True,
    )

    sale_number = serializers.CharField(
        source="sale.sale_number",
        read_only=True,
    )

    class Meta:
        model = SalesReturn
        fields = "__all__"
        read_only_fields = (
            "id",
            "return_number",
            "requested_by",
            "approved_by",
            "created_at",
            "updated_at",
        )


class SalesReturnItemCreateSerializer(serializers.Serializer):
    sale_item = serializers.PrimaryKeyRelatedField(
        queryset=SaleItem.objects.all(),
    )

    quantity = serializers.IntegerField(min_value=1)

    condition_notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )


class SalesReturnCreateSerializer(serializers.Serializer):
    sale = serializers.PrimaryKeyRelatedField(
        queryset=Sale.objects.all(),
    )

    reason = serializers.CharField()

    items = SalesReturnItemCreateSerializer(
        many=True,
        allow_empty=False,
    )

    def validate(self, attrs):
        sale = attrs["sale"]

        if sale.status == Sale.Status.CANCELLED:
            raise serializers.ValidationError(
                "A cancelled sale cannot be returned."
            )

        for item in attrs["items"]:
            sale_item = item["sale_item"]

            if sale_item.sale_id != sale.pk:
                raise serializers.ValidationError(
                    "Every return item must belong to the selected sale."
                )

            if item["quantity"] > sale_item.quantity_fulfilled:
                raise serializers.ValidationError(
                    "Return quantity cannot exceed fulfilled quantity."
                )

        return attrs

    def create(self, validated_data):
        items = validated_data.pop("items")

        with transaction.atomic():
            sales_return = SalesReturn.objects.create(
                **validated_data,
                requested_by=self.context["request"].user,
                return_number=(
                    f"RET-{uuid.uuid4().hex[:10].upper()}"
                ),
            )

            for item in items:
                sale_item = item["sale_item"]

                # The refund unit price is taken from the original sale.
                SalesReturnItem.objects.create(
                    sales_return=sales_return,
                    sale_item=sale_item,
                    quantity=item["quantity"],
                    unit_refund_amount=sale_item.unit_price,
                    condition_notes=item.get("condition_notes", ""),
                )

        return sales_return
