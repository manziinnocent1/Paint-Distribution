from rest_framework import serializers

from .models import (
    Supplier,
    SupplierContact,
    SupplierProduct,
)


class SupplierContactSerializer(serializers.ModelSerializer):

    class Meta:
        model = SupplierContact
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class SupplierProductSerializer(serializers.ModelSerializer):

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
        model = SupplierProduct
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        supplier = attrs.get(
            "supplier",
            getattr(self.instance, "supplier", None),
        )

        variant = attrs.get(
            "product_variant",
            getattr(self.instance, "product_variant", None),
        )

        if supplier and variant:
            duplicate = SupplierProduct.objects.filter(
                supplier=supplier,
                product_variant=variant,
            )

            if self.instance:
                duplicate = duplicate.exclude(pk=self.instance.pk)

            if duplicate.exists():
                raise serializers.ValidationError(
                    "This product variant is already registered "
                    "for this supplier."
                )

        return attrs


class SupplierSerializer(serializers.ModelSerializer):

    contacts = SupplierContactSerializer(
        many=True,
        read_only=True,
    )

    products = SupplierProductSerializer(
        many=True,
        read_only=True,
    )

    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Supplier
        fields = "__all__"

        read_only_fields = (
            "id",
            "supplier_number",
            "created_by",
            "created_at",
            "updated_at",
        )

    def get_created_by_name(self, obj):
        if not obj.created_by:
            return None

        return obj.created_by.get_full_name()

    def validate_payment_terms_days(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Payment terms cannot be negative."
            )

        return value