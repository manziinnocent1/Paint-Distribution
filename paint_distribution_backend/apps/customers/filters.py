import django_filters

from apps.customers.models import Customer, CustomerAddress


class CustomerFilter(django_filters.FilterSet):
    class Meta:
        model = Customer
        fields = [
            "customer_type",
            "status",
            "assigned_to",
        ]


class CustomerAddressFilter(django_filters.FilterSet):
    class Meta:
        model = CustomerAddress
        fields = [
            "customer",
            "address_type",
            "is_default",
            "is_active",
            "district",
            "province",
        ]