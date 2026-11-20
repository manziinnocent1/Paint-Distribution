from django.contrib import admin

from .models import Supplier, SupplierContact, SupplierProduct


class SupplierContactInline(admin.TabularInline):
    model = SupplierContact
    extra = 0


class SupplierProductInline(admin.TabularInline):
    model = SupplierProduct
    extra = 0


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = (
        "supplier_number",
        "name",
        "supplier_type",
        "phone_number",
        "status",
    )
    list_filter = ("supplier_type", "status", "country")
    search_fields = (
        "supplier_number",
        "name",
        "email",
        "phone_number",
        "tax_identification_number",
    )
    inlines = [SupplierContactInline, SupplierProductInline]
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(SupplierContact)
class SupplierContactAdmin(admin.ModelAdmin):
    list_display = ("full_name", "supplier", "phone_number", "is_primary")
    search_fields = ("full_name", "supplier__name", "email")


@admin.register(SupplierProduct)
class SupplierProductAdmin(admin.ModelAdmin):
    list_display = (
        "supplier",
        "product_variant",
        "last_purchase_price",
        "currency",
        "is_preferred",
        "is_active",
    )
    list_filter = ("is_preferred", "is_active", "currency")
    search_fields = ("supplier__name", "product_variant__sku")