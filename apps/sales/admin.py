from django.contrib import admin

from .models import (
    SalesQuotation,
    SalesQuotationItem,
    Sale,
    SaleItem,
    SalesReturn,
    SalesReturnItem,
)


class SalesQuotationItemInline(admin.TabularInline):
    model = SalesQuotationItem
    extra = 0


class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0
    readonly_fields = ("quantity_fulfilled",)


class SalesReturnItemInline(admin.TabularInline):
    model = SalesReturnItem
    extra = 0


@admin.register(SalesQuotation)
class SalesQuotationAdmin(admin.ModelAdmin):
    list_display = (
        "quotation_number",
        "customer",
        "total_amount",
        "status",
        "quotation_date",
    )
    list_filter = ("status", "quotation_date")
    search_fields = (
        "quotation_number",
        "customer__customer_number",
        "customer__business_name",
    )
    inlines = [SalesQuotationItemInline]


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = (
        "sale_number",
        "customer",
        "sales_channel",
        "total_amount",
        "status",
        "sale_date",
    )
    list_filter = ("status", "sales_channel", "sale_date")
    search_fields = (
        "sale_number",
        "customer__customer_number",
        "customer__business_name",
    )
    inlines = [SaleItemInline]
    readonly_fields = (
        "id",
        "subtotal",
        "discount_amount",
        "tax_amount",
        "total_amount",
        "confirmed_by",
        "confirmed_at",
        "created_at",
        "updated_at",
    )


@admin.register(SalesReturn)
class SalesReturnAdmin(admin.ModelAdmin):
    list_display = (
        "return_number",
        "sale",
        "status",
        "requested_by",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("return_number", "sale__sale_number")
    inlines = [SalesReturnItemInline]