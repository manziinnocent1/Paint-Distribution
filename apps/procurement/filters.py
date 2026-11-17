import django_filters

from .models import (
    PurchaseRequest,
    PurchaseOrder,
    GoodsReceipt,
)


class PurchaseRequestFilter(django_filters.FilterSet):

    status = django_filters.CharFilter(
        field_name="status",
        lookup_expr="iexact",
    )

    requested_by = django_filters.UUIDFilter(
        field_name="requested_by_id",
    )

    required_date_after = django_filters.DateFilter(
        field_name="required_date",
        lookup_expr="gte",
    )

    required_date_before = django_filters.DateFilter(
        field_name="required_date",
        lookup_expr="lte",
    )

    class Meta:
        model = PurchaseRequest
        fields = ["status", "requested_by"]


class PurchaseOrderFilter(django_filters.FilterSet):

    status = django_filters.CharFilter(
        field_name="status",
        lookup_expr="iexact",
    )

    supplier = django_filters.UUIDFilter(
        field_name="supplier_id",
    )

    warehouse = django_filters.UUIDFilter(
        field_name="warehouse_id",
    )

    order_date_after = django_filters.DateFilter(
        field_name="order_date",
        lookup_expr="gte",
    )

    order_date_before = django_filters.DateFilter(
        field_name="order_date",
        lookup_expr="lte",
    )

    class Meta:
        model = PurchaseOrder
        fields = ["status", "supplier", "warehouse"]


class GoodsReceiptFilter(django_filters.FilterSet):

    purchase_order = django_filters.UUIDFilter(
        field_name="purchase_order_id",
    )

    received_date_after = django_filters.DateFilter(
        field_name="received_date",
        lookup_expr="gte",
    )

    received_date_before = django_filters.DateFilter(
        field_name="received_date",
        lookup_expr="lte",
    )

    class Meta:
        model = GoodsReceipt
        fields = ["purchase_order", "status"]