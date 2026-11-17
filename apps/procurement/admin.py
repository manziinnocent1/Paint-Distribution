from django.contrib import admin

from .models import (
    PurchaseRequest,
    PurchaseRequestItem,
    PurchaseOrder,
    PurchaseOrderItem,
    GoodsReceipt,
    GoodsReceiptItem,
)


class PurchaseRequestItemInline(admin.TabularInline):
    model = PurchaseRequestItem
    extra = 0


class PurchaseOrderItemInline(admin.TabularInline):
    model = PurchaseOrderItem
    extra = 0
    readonly_fields = ("quantity_received", "line_total")


class GoodsReceiptItemInline(admin.TabularInline):
    model = GoodsReceiptItem
    extra = 0


@admin.register(PurchaseRequest)
class PurchaseRequestAdmin(admin.ModelAdmin):
    list_display = (
        "request_number",
        "requested_by",
        "department",
        "status",
        "created_at",
    )
    list_filter = ("status", "department")
    search_fields = ("request_number", "reason")
    inlines = [PurchaseRequestItemInline]


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = (
        "purchase_order_number",
        "supplier",
        "warehouse",
        "total_amount",
        "status",
        "order_date",
    )
    list_filter = ("status", "currency", "order_date")
    search_fields = (
        "purchase_order_number",
        "supplier__name",
        "supplier__supplier_number",
    )
    inlines = [PurchaseOrderItemInline]
    readonly_fields = (
        "id",
        "subtotal",
        "tax_amount",
        "total_amount",
        "approved_by",
        "approved_at",
        "created_at",
        "updated_at",
    )


@admin.register(GoodsReceipt)
class GoodsReceiptAdmin(admin.ModelAdmin):
    list_display = (
        "receipt_number",
        "purchase_order",
        "received_date",
        "status",
        "received_by",
    )
    list_filter = ("status", "received_date")
    search_fields = (
        "receipt_number",
        "purchase_order__purchase_order_number",
        "supplier_delivery_note",
    )
    inlines = [GoodsReceiptItemInline]
    readonly_fields = ("id", "confirmed_at", "created_at")