import django_filters

from apps.catalog.models import (
    Category,
    Brand,
    Product,
    ProductVariant,
)


class CategoryFilter(django_filters.FilterSet):
    class Meta:
        model = Category
        fields = ["parent", "is_active"]


class BrandFilter(django_filters.FilterSet):
    class Meta:
        model = Brand
        fields = ["is_active"]


class ProductFilter(django_filters.FilterSet):
    min_tax_rate = django_filters.NumberFilter(
        field_name="tax_rate",
        lookup_expr="gte",
    )

    max_tax_rate = django_filters.NumberFilter(
        field_name="tax_rate",
        lookup_expr="lte",
    )

    class Meta:
        model = Product
        fields = [
            "category",
            "brand",
            "product_type",
            "status",
            "is_manufactured",
            "is_distributed",
            "requires_colour_mixing",
            "min_tax_rate",
            "max_tax_rate",
        ]


class ProductVariantFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(
        field_name="selling_price",
        lookup_expr="gte",
    )

    max_price = django_filters.NumberFilter(
        field_name="selling_price",
        lookup_expr="lte",
    )

    class Meta:
        model = ProductVariant
        fields = [
            "product",
            "paint_finish",
            "paint_base",
            "is_active",
            "min_price",
            "max_price",
        ]