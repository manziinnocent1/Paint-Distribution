from django.contrib import admin

from apps.colors.models import (
    ColorFamily,
    Color,
    ColorFormula,
    ColorFormulaIngredient,
)


@admin.register(ColorFamily)
class ColorFamilyAdmin(admin.ModelAdmin):
    list_display = ["name", "is_active", "created_at"]
    list_filter = ["is_active"]
    search_fields = ["name"]


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "code",
        "color_type",
        "family",
        "base_type",
        "is_active",
    ]

    list_filter = [
        "color_type",
        "base_type",
        "is_mixable",
        "is_active",
    ]

    search_fields = ["name", "code", "ral_code"]


class ColorFormulaIngredientInline(admin.TabularInline):
    model = ColorFormulaIngredient
    extra = 0


@admin.register(ColorFormula)
class ColorFormulaAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "color",
        "version",
        "paint_product",
        "batch_size",
        "batch_unit",
        "is_active",
    ]

    list_filter = ["is_active", "batch_unit"]
    search_fields = ["name", "color__name", "color__code"]
    inlines = [ColorFormulaIngredientInline]


@admin.register(ColorFormulaIngredient)
class ColorFormulaIngredientAdmin(admin.ModelAdmin):
    list_display = [
        "ingredient_name",
        "formula",
        "quantity",
        "unit",
        "sequence",
    ]

    list_filter = ["unit"]
    search_fields = [
        "ingredient_name",
        "ingredient_code",
        "formula__color__name",
    ]