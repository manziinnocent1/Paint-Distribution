from rest_framework import serializers

from apps.catalog.models import (
    Category,
    Brand,
    Product,
    ProductVariant,
    ProductImage,
    ProductAttribute,
    ProductAttributeValue,
)


class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(
        source="parent.name",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "parent",
            "parent_name",
            "image",
            "is_active",
            "display_order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "logo",
            "website",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ProductVariantSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "product",
            "product_name",
            "name",
            "sku",
            "barcode",
            "volume_ml",
            "weight_grams",
            "unit_of_measure",
            "paint_finish",
            "paint_base",
            "colour_name",
            "colour_code",
            "hex_colour",
            "ral_code",
            "cost_price",
            "selling_price",
            "wholesale_price",
            "minimum_selling_price",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_hex_colour(self, value):
        if value and (
            len(value) != 7
            or not value.startswith("#")
        ):
            raise serializers.ValidationError(
                "Enter a valid hex colour such as #FFFFFF."
            )

        if value:
            try:
                int(value[1:], 16)
            except ValueError:
                raise serializers.ValidationError(
                    "The colour must contain valid hexadecimal characters."
                )

        return value.upper() if value else value

    def validate(self, attrs):
        minimum_price = attrs.get(
            "minimum_selling_price",
            getattr(self.instance, "minimum_selling_price", None),
        )

        selling_price = attrs.get(
            "selling_price",
            getattr(self.instance, "selling_price", None),
        )

        if (
            minimum_price is not None
            and selling_price is not None
            and minimum_price > selling_price
        ):
            raise serializers.ValidationError({
                "minimum_selling_price": (
                    "Minimum selling price cannot exceed the selling price."
                )
            })

        return attrs


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = [
            "id",
            "product",
            "variant",
            "image",
            "alt_text",
            "is_primary",
            "display_order",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate(self, attrs):
        product = attrs.get(
            "product",
            getattr(self.instance, "product", None),
        )
        variant = attrs.get(
            "variant",
            getattr(self.instance, "variant", None),
        )

        if variant and product and variant.product_id != product.id:
            raise serializers.ValidationError({
                "variant": "The selected variant must belong to the selected product."
            })

        return attrs


class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = [
            "id",
            "name",
            "description",
            "is_filterable",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ProductAttributeValueSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(
        source="attribute.name",
        read_only=True,
    )

    class Meta:
        model = ProductAttributeValue
        fields = [
            "id",
            "product",
            "attribute",
            "attribute_name",
            "value",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    brand_name = serializers.CharField(
        source="brand.name",
        read_only=True,
        allow_null=True,
    )

    variants = ProductVariantSerializer(
        many=True,
        read_only=True,
    )

    images = ProductImageSerializer(
        many=True,
        read_only=True,
    )

    attribute_values = ProductAttributeValueSerializer(
        many=True,
        read_only=True,
    )

    created_by_email = serializers.CharField(
        source="created_by.email",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "product_code",
            "description",
            "category",
            "category_name",
            "brand",
            "brand_name",
            "product_type",
            "status",
            "is_manufactured",
            "is_distributed",
            "requires_colour_mixing",
            "technical_specifications",
            "safety_information",
            "warranty_information",
            "tax_rate",
            "created_by",
            "created_by_email",
            "variants",
            "images",
            "attribute_values",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_by",
            "created_at",
            "updated_at",
        ]