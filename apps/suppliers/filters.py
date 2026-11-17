import django_filters

from .models import Supplier, SupplierProduct


class SupplierFilter(django_filters.FilterSet):

    status = django_filters.CharFilter(
        field_name="status",
        lookup_expr="iexact",
    )

    supplier_type = django_filters.CharFilter(
        field_name="supplier_type",
        lookup_expr="iexact",
    )

    country = django_filters.CharFilter(
        field_name="country",
        lookup_expr="icontains",
    )

    name = django_filters.CharFilter(
        field_name="name",
        lookup_expr="icontains",
    )

    class Meta:
        model = Supplier
        fields = [
            "status",
            "supplier_type",
            "country",
        ]


class SupplierProductFilter(django_filters.FilterSet):

    supplier = django_filters.UUIDFilter(
        field_name="supplier_id",
    )

    product_variant = django_filters.UUIDFilter(
        field_name="product_variant_id",
    )

    is_preferred = django_filters.BooleanFilter()

    is_active = django_filters.BooleanFilter()

    class Meta:
        model = SupplierProduct
        fields = [
            "supplier",
            "product_variant",
            "is_preferred",
            "is_active",
        ]