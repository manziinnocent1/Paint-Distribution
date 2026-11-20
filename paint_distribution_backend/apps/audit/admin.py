from django.contrib import admin

from apps.audit.models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = [
        "action",
        "actor",
        "object_repr",
        "created_at",
    ]

    list_filter = [
        "action",
        "created_at",
    ]

    search_fields = [
        "description",
        "object_repr",
        "actor__email",
    ]

    readonly_fields = [
        "id",
        "actor",
        "action",
        "description",
        "content_type",
        "object_id",
        "object_repr",
        "changes",
        "metadata",
        "ip_address",
        "user_agent",
        "created_at",
        "updated_at",
    ]

    ordering = ["-created_at"]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False