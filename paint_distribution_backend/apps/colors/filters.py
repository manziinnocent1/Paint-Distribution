import django_filters

from apps.colors.models import Color, ColorFormula


class ColorFilter(django_filters.FilterSet):
    class Meta:
        model = Color
        fields = [
            "color_type",
            "family",
            "base_type",
            "is_mixable",
            "is_active",
        ]


class ColorFormulaFilter(django_filters.FilterSet):
    class Meta:
        model = ColorFormula
        fields = [
            "color",
            "paint_product",
            "paint_variant",
            "is_active",
        ]