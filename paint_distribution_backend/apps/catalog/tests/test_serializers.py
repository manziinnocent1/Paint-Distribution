import pytest

from apps.catalog.models import (
    Category,
    Product,
    ProductVariant,
)

from apps.catalog.serializers import (
    ProductVariantSerializer,
)


@pytest.mark.django_db
def test_variant_serializer_rejects_invalid_hex_colour():
    category = Category.objects.create(
        name="Paint",
        slug="paint",
    )

    product = Product.objects.create(
        name="Wall Paint",
        slug="wall-paint",
        product_code="PNT-100",
        category=category,
    )

    serializer = ProductVariantSerializer(
        data={
            "product": str(product.pk),
            "name": "Red Paint 5L",
            "sku": "PNT-100-RED-5L",
            "volume_ml": 5000,
            "selling_price": "15000.00",
            "hex_colour": "NOT-A-HEX",
        }
    )

    assert serializer.is_valid() is False
    assert "hex_colour" in serializer.errors


@pytest.mark.django_db
def test_variant_serializer_accepts_valid_hex_colour():
    category = Category.objects.create(
        name="Paint",
        slug="paint",
    )

    product = Product.objects.create(
        name="Wall Paint",
        slug="wall-paint",
        product_code="PNT-101",
        category=category,
    )

    serializer = ProductVariantSerializer(
        data={
            "product": str(product.pk),
            "name": "Blue Paint 5L",
            "sku": "PNT-101-BLU-5L",
            "volume_ml": 5000,
            "selling_price": "15000.00",
            "hex_colour": "#0000FF",
        }
    )

    assert serializer.is_valid(), serializer.errors
    assert serializer.validated_data["hex_colour"] == "#0000FF"