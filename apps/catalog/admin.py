from django.contrib import admin

from apps.catalog.models import (
    Category,
    Brand,
    Product,
    ProductVariant,
    ProductImage,
    ProductAttribute,
    ProductAttributeValue,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "parent",
        "is_active",
        "display_order",
    ]

    list_filter = ["is_active"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    ordering = ["display_order", "name"]


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "website",
        "is_active",
    ]

    list_filter = ["is_active"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0
    show_change_link = True


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0


class ProductAttributeValueInline(admin.TabularInline):
    model = ProductAttributeValue
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "product_code",
        "category",
        "brand",
        "product_type",
        "status",
        "is_manufactured",
        "is_distributed",
    ]

    list_filter = [
        "product_type",
        "status",
        "is_manufactured",
        "is_distributed",
        "requires_colour_mixing",
    ]

    search_fields = [
        "name",
        "product_code",
        "description",
    ]

    prepopulated_fields = {"slug": ("name",)}

    inlines = [
        ProductVariantInline,
        ProductImageInline,
        ProductAttributeValueInline,
    ]


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "product",
        "sku",
        "volume_ml",
        "paint_finish",
        "paint_base",
        "selling_price",
        "is_active",
    ]

    list_filter = [
        "paint_finish",
        "paint_base",
        "is_active",
    ]

    search_fields = [
        "name",
        "sku",
        "barcode",
        "colour_name",
        "colour_code",
        "product__name",
    ]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = [
        "product",
        "variant",
        "is_primary",
        "display_order",
    ]

    list_filter = ["is_primary"]
    search_fields = ["product__name", "alt_text"]


@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "is_filterable",
    ]

    search_fields = ["name"]


@admin.register(ProductAttributeValue)
class ProductAttributeValueAdmin(admin.ModelAdmin):
    list_display = [
        "product",
        "attribute",
        "value",
    ]

    list_filter = ["attribute"]
    search_fields = [
        "product__name",
        "attribute__name",
        "value",
    ]