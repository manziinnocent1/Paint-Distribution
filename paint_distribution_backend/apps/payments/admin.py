
from django.contrib import admin

from .models import Payment, PaymentRefund


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "payment_number",
        "customer",
        "amount",
        "currency",
        "payment_method",
        "status",
        "created_at",
    )
    list_filter = ("status", "payment_method", "currency")
    search_fields = (
        "payment_number",
        "customer__customer_number",
        "customer__business_name",
        "transaction_reference",
    )
    readonly_fields = (
        "id",
        "payment_number",
        "status",
        "initiated_by",
        "confirmed_by",
        "paid_at",
        "provider_response",
        "created_at",
        "updated_at",
    )


@admin.register(PaymentRefund)
class PaymentRefundAdmin(admin.ModelAdmin):
    list_display = (
        "refund_number",
        "payment",
        "amount",
        "status",
        "processed_at",
    )
    list_filter = ("status",)
    search_fields = ("refund_number", "payment__payment_number")
    readonly_fields = (
        "id",
        "refund_number",
        "status",
        "processed_by",
        "processed_at",
        "created_at",
    )
