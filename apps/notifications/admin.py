
from django.contrib import admin

from .models import Notification, NotificationPreference


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "recipient",
        "notification_type",
        "priority",
        "is_read",
        "created_at",
    )
    list_filter = (
        "notification_type",
        "priority",
        "is_read",
        "created_at",
    )
    search_fields = (
        "title",
        "message",
        "recipient__email",
    )
    readonly_fields = ("id", "created_at", "read_at")


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "in_app_enabled",
        "email_enabled",
        "sms_enabled",
    )
    search_fields = ("user__email",)
    readonly_fields = ("id", "created_at", "updated_at")
