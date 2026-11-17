import pytest

from apps.catalog.models import (
    Category,
    Brand,
    Product,
    ProductVariant,
)


@pytest.mark.django_db
def test_create_category():
    category = Category.objects.create(
        name="Interior Paint",
        slug="interior-paint",
    )

    assert category.pk is not None
    assert category.name == "Interior Paint"


@pytest.mark.django_db
def test_create_brand():
    brand = Brand.objects.create(
        name="Example Paint",
        slug="example-paint",
    )

    assert brand.pk is not None
    assert brand.is_active is True


@pytest.mark.django_db
def test_create_paint_product_and_variant():
    category = Category.objects.create(
        name="Wall Paint",
        slug="wall-paint",
    )

    brand = Brand.objects.create(
        name="Example Paint",
        slug="example-paint",
    )

    product = Product.objects.create(
        name="Premium Interior Paint",
        slug="premium-interior-paint",
        product_code="PNT-001",
        category=category,
        brand=brand,
        product_type=Product.ProductType.PAINT,
        is_manufactured=True,
        requires_colour_mixing=True,
    )

    variant = ProductVariant.objects.create(
        product=product,
        name="White Matte 20L",
        sku="PNT-001-WHT-20L",
        volume_ml=20000,
        paint_finish=ProductVariant.PaintFinish.MATTE,
        paint_base=ProductVariant.PaintBase.WHITE,
        colour_name="White",
        hex_colour="#FFFFFF",
        cost_price="12000.00",
        selling_price="18000.00",
    )

    assert product.variants.count() == 1
    assert variant.volume_ml == 20000
    assert variant.selling_price == 18000