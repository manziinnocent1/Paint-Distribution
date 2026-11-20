import django_filters

from .models import (
    SalesQuotation,
    Sale,
    SalesReturn,
)


class SalesQuotationFilter(django_filters.FilterSet):

    status = django_filters.CharFilter(
        field_name="status",
        lookup_expr="iexact",
    )

    customer = django_filters.UUIDFilter(
        field_name="customer_id",
    )

    warehouse = django_filters.UUIDFilter(
        field_name="warehouse_id",
    )

    quotation_date_after = django_filters.DateFilter(
        field_name="quotation_date",
        lookup_expr="gte",
    )

    quotation_date_before = django_filters.DateFilter(
        field_name="quotation_date",
        lookup_expr="lte",
    )

    class Meta:
        model = SalesQuotation
        fields = ["status", "customer", "warehouse"]


class SaleFilter(django_filters.FilterSet):

    status = django_filters.CharFilter(
        field_name="status",
        lookup_expr="iexact",
    )

    channel = django_filters.CharFilter(
        field_name="channel",
        lookup_expr="iexact",
    )

    customer = django_filters.UUIDFilter(
        field_name="customer_id",
    )

    warehouse = django_filters.UUIDFilter(
        field_name="warehouse_id",
    )

    sale_date_after = django_filters.DateFilter(
        field_name="sale_date",
        lookup_expr="gte",
    )

    sale_date_before = django_filters.DateFilter(
        field_name="sale_date",
        lookup_expr="lte",
    )

    class Meta:
        model = Sale
        fields = [
            "status",
            "channel",
            "customer",
            "warehouse",
        ]


class SalesReturnFilter(django_filters.FilterSet):

    status = django_filters.CharFilter(
        field_name="status",
        lookup_expr="iexact",
    )

    sale = django_filters.UUIDFilter(
        field_name="sale_id",
    )

    class Meta:
        model = SalesReturn
        fields = ["status", "sale"]