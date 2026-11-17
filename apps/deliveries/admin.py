from django.contrib import admin

from apps.deliveries.models import (
    Delivery,
    DeliveryStatusHistory,
)


class DeliveryStatusHistoryInline(admin.TabularInline):
    model = DeliveryStatusHistory
    extra = 0
    readonly_fields = [
        "previous_status",
        "new_status",
        "note",
        "updated_by",
        "created_at",
    ]
    can_delete = False


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = [
        "delivery_number",
        "tracking_number",
        "customer",
        "status",
        "vehicle_type",
        "driver_name",
        "estimated_delivery_at",
        "delivered_at",
    ]

    list_filter = [
        "status",
        "vehicle_type",
        "created_at",
    ]

    search_fields = [
        "delivery_number",
        "tracking_number",
        "order_reference",
        "customer__customer_number",
        "customer__business_name",
        "driver_name",
        "driver_phone",
    ]

    readonly_fields = [
        "delivery_number",
        "tracking_number",
        "created_at",
        "updated_at",
        "dispatched_at",
        "delivered_at",
    ]

    inlines = [DeliveryStatusHistoryInline]


@admin.register(DeliveryStatusHistory)
class DeliveryStatusHistoryAdmin(admin.ModelAdmin):
    list_display = [
        "delivery",
        "previous_status",
        "new_status",
        "updated_by",
        "created_at",
    ]

    list_filter = [
        "previous_status",
        "new_status",
        "created_at",
    ]

    search_fields = [
        "delivery__delivery_number",
        "delivery__tracking_number",
        "note",
    ]

    readonly_fields = [
        "delivery",
        "previous_status",
        "new_status",
        "note",
        "updated_by",
        "created_at",
        "updated_at",
    ]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False