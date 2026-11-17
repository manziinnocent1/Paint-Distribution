import django_filters

from apps.deliveries.models import Delivery


class DeliveryFilter(django_filters.FilterSet):
    created_from = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__gte",
    )

    created_to = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__lte",
    )

    class Meta:
        model = Delivery
        fields = [
            "status",
            "customer",
            "assigned_driver",
            "vehicle_type",
            "order_reference",
            "created_from",
            "created_to",
        ]