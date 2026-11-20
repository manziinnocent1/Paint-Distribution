from rest_framework import serializers

from apps.colors.models import (
    ColorFamily,
    Color,
    ColorFormula,
    ColorFormulaIngredient,
)


class ColorFamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorFamily
        fields = [
            "id",
            "name",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ColorSerializer(serializers.ModelSerializer):
    family_name = serializers.CharField(
        source="family.name",
        read_only=True,
        allow_null=True,
    )

    created_by_email = serializers.CharField(
        source="created_by.email",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Color
        fields = [
            "id",
            "name",
            "code",
            "color_type",
            "family",
            "family_name",
            "base_type",
            "hex_code",
            "ral_code",
            "description",
            "is_mixable",
            "is_active",
            "created_by",
            "created_by_email",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def validate_hex_code(self, value):
        if not value:
            return value

        if (
            len(value) != 7
            or not value.startswith("#")
        ):
            raise serializers.ValidationError(
                "Enter a valid HEX colour, for example #FFFFFF."
            )

        try:
            int(value[1:], 16)
        except ValueError:
            raise serializers.ValidationError(
                "HEX colour must contain valid hexadecimal characters."
            )

        return value.upper()


class ColorFormulaIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorFormulaIngredient
        fields = [
            "id",
            "formula",
            "ingredient_name",
            "ingredient_code",
            "quantity",
            "unit",
            "sequence",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ColorFormulaSerializer(serializers.ModelSerializer):
    color_name = serializers.CharField(
        source="color.name",
        read_only=True,
    )

    ingredients = ColorFormulaIngredientSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = ColorFormula
        fields = [
            "id",
            "color",
            "color_name",
            "name",
            "version",
            "paint_product",
            "paint_variant",
            "batch_size",
            "batch_unit",
            "notes",
            "is_active",
            "created_by",
            "ingredients",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        product = attrs.get(
            "paint_product",
            getattr(self.instance, "paint_product", None),
        )

        variant = attrs.get(
            "paint_variant",
            getattr(self.instance, "paint_variant", None),
        )

        if (
            product
            and variant
            and variant.product_id != product.id
        ):
            raise serializers.ValidationError({
                "paint_variant": (
                    "The selected variant must belong to the selected product."
                )
            })

        return attrs