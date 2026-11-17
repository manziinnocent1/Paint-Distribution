from django.contrib import admin

from apps.customers.models import (
    Customer,
    CustomerAddress,
    CustomerContact,
)


class CustomerAddressInline(admin.TabularInline):
    model = CustomerAddress
    extra = 0


class CustomerContactInline(admin.TabularInline):
    model = CustomerContact
    extra = 0


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = [
        "customer_number",
        "customer_type",
        "first_name",
        "business_name",
        "phone_number",
        "status",
        "created_at",
    ]

    list_filter = [
        "customer_type",
        "status",
        "created_at",
    ]

    search_fields = [
        "customer_number",
        "first_name",
        "last_name",
        "business_name",
        "email",
        "phone_number",
    ]

    readonly_fields = [
        "customer_number",
        "created_at",
        "updated_at",
    ]

    inlines = [
        CustomerAddressInline,
        CustomerContactInline,
    ]


@admin.register(CustomerAddress)
class CustomerAddressAdmin(admin.ModelAdmin):
    list_display = [
        "customer",
        "address_type",
        "label",
        "district",
        "sector",
        "is_default",
        "is_active",
    ]

    list_filter = [
        "address_type",
        "is_default",
        "is_active",
        "district",
    ]

    search_fields = [
        "customer__customer_number",
        "customer__business_name",
        "label",
        "district",
        "sector",
        "street_address",
    ]


@admin.register(CustomerContact)
class CustomerContactAdmin(admin.ModelAdmin):
    list_display = [
        "full_name",
        "customer",
        "job_title",
        "phone_number",
        "is_primary",
    ]

    list_filter = ["is_primary"]
    search_fields = ["full_name", "email", "phone_number"]