
from django.contrib import admin

from .models import Price, Discount


@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = (
        "product_variant_id",
        "price_type",
        "customer",
        "amount",
        "currency",
        "status",
        "effective_from",
    )
    list_filter = ("price_type", "status", "currency")
    search_fields = (
        "product_variant_id",
        "customer__customer_number",
        "customer__business_name",
    )
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "code",
        "discount_type",
        "value",
        "status",
        "starts_at",
        "ends_at",
    )
    list_filter = ("discount_type", "status")
    search_fields = ("name", "code")
    readonly_fields = ("id", "created_at", "updated_at")
