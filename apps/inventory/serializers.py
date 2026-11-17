from rest_framework import serializers

from apps.inventory.models import (
    Warehouse,
    StockLevel,
    StockMovement,
)


class WarehouseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Warehouse
        fields = [
            "id",
            "name",
            "code",
            "description",
            "country",
            "province",
            "district",
            "sector",
            "street_address",
            "contact_person",
            "contact_phone",
            "status",
            "is_default",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


class StockLevelSerializer(serializers.ModelSerializer):

    warehouse_name = serializers.CharField(
        source="warehouse.name",
        read_only=True,
    )

    product_name = serializers.CharField(
        source="product_variant.product.name",
        read_only=True,
    )

    sku = serializers.CharField(
        source="product_variant.sku",
        read_only=True,
    )

    available_quantity = serializers.DecimalField(
        max_digits=14,
        decimal_places=3,
        read_only=True,
    )

    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = StockLevel
        fields = [
            "id",
            "warehouse",
            "warehouse_name",
            "product_variant",
            "product_name",
            "sku",
            "quantity_on_hand",
            "quantity_reserved",
            "available_quantity",
            "reorder_level",
            "maximum_stock_level",
            "is_low_stock",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "quantity_on_hand",
            "quantity_reserved",
            "created_at",
            "updated_at",
        ]


class StockMovementSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product_variant.product.name",
        read_only=True,
    )

    sku = serializers.CharField(
        source="product_variant.sku",
        read_only=True,
    )

    source_warehouse_name = serializers.CharField(
        source="from_warehouse.name",
        read_only=True,
        allow_null=True,
    )

    destination_warehouse_name = serializers.CharField(
        source="to_warehouse.name",
        read_only=True,
        allow_null=True,
    )

    performed_by_email = serializers.CharField(
        source="performed_by.email",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = StockMovement
        fields = [
            "id",
            "movement_number",
            "product_variant",
            "product_name",
            "sku",
            "movement_type",
            "from_warehouse",
            "source_warehouse_name",
            "to_warehouse",
            "destination_warehouse_name",
            "quantity",
            "unit_cost",
            "reference",
            "reason",
            "performed_by",
            "performed_by_email",
            "created_at",
        ]

        read_only_fields = fields


class StockOperationSerializer(serializers.Serializer):

    class Operation(models.TextChoices):
        RECEIPT = "RECEIPT", "Receive stock"
        ISSUE = "ISSUE", "Issue stock"
        TRANSFER = "TRANSFER", "Transfer stock"

    operation = serializers.ChoiceField(
        choices=Operation.choices,
    )

    product_variant = serializers.UUIDField()

    from_warehouse = serializers.UUIDField(
        required=False,
        allow_null=True,
    )

    to_warehouse = serializers.UUIDField(
        required=False,
        allow_null=True,
    )

    quantity = serializers.DecimalField(
        max_digits=14,
        decimal_places=3,
        min_value=0.001,
    )

    unit_cost = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        min_value=0,
        required=False,
        allow_null=True,
    )

    reference = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    reason = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    def validate(self, attrs):
        operation = attrs["operation"]
        source = attrs.get("from_warehouse")
        destination = attrs.get("to_warehouse")

        if operation == self.Operation.RECEIPT and not destination:
            raise serializers.ValidationError({
                "to_warehouse": "A destination warehouse is required for receipts."
            })

        if operation == self.Operation.ISSUE and not source:
            raise serializers.ValidationError({
                "from_warehouse": "A source warehouse is required for issues."
            })

        if operation == self.Operation.TRANSFER:
            if not source or not destination:
                raise serializers.ValidationError(
                    "Both source and destination warehouses are required for transfers."
                )

            if source == destination:
                raise serializers.ValidationError({
                    "to_warehouse": "Choose a different destination warehouse."
                })

        return attrs