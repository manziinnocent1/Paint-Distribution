import django_filters

from django.db.models import F

from apps.inventory.models import StockLevel, StockMovement


class StockLevelFilter(django_filters.FilterSet):

    low_stock = django_filters.BooleanFilter(
        method="filter_low_stock",
    )

    class Meta:
        model = StockLevel
        fields = [
            "warehouse",
            "product_variant",
        ]

    def filter_low_stock(self, queryset, name, value):
        if value is True:
            return (
                queryset
                .annotate(
                    available_stock=(
                        F("quantity_on_hand")
                        - F("quantity_reserved")
                    )
                )
                .filter(
                    available_stock__lte=F("reorder_level")
                )
            )

        if value is False:
            return (
                queryset
                .annotate(
                    available_stock=(
                        F("quantity_on_hand")
                        - F("quantity_reserved")
                    )
                )
                .filter(
                    available_stock__gt=F("reorder_level")
                )
            )

        return queryset


class StockMovementFilter(django_filters.FilterSet):

    created_from = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__gte",
    )

    created_to = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__lte",
    )

    class Meta:
        model = StockMovement
        fields = [
            "movement_type",
            "product_variant",
            "from_warehouse",
            "to_warehouse",
            "performed_by",
            "created_from",
            "created_to",
        ]