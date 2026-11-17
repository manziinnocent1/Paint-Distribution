from django.contrib import admin

from apps.inventory.models import (
    Warehouse,
    StockLevel,
    StockMovement,
)


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):

    list_display = [
        "name",
        "code",
        "district",
        "status",
        "is_default",
    ]

    list_filter = ["status", "is_default"]
    search_fields = ["name", "code", "district"]


@admin.register(StockLevel)
class StockLevelAdmin(admin.ModelAdmin):

    list_display = [
        "product_variant",
        "warehouse",
        "quantity_on_hand",
        "quantity_reserved",
        "reorder_level",
    ]

    list_filter = ["warehouse"]
    search_fields = [
        "product_variant__sku",
        "product_variant__product__name",
        "warehouse__name",
    ]

    readonly_fields = [
        "quantity_on_hand",
        "quantity_reserved",
        "created_at",
        "updated_at",
    ]

    def has_add_permission(self, request):
        return False


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):

    list_display = [
        "movement_number",
        "product_variant",
        "movement_type",
        "quantity",
        "from_warehouse",
        "to_warehouse",
        "performed_by",
        "created_at",
    ]

    list_filter = [
        "movement_type",
        "created_at",
    ]

    search_fields = [
        "movement_number",
        "reference",
        "product_variant__sku",
    ]

    readonly_fields = [
        field.name
        for field in StockMovement._meta.fields
    ]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False