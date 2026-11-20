from rest_framework import serializers

from apps.audit.models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(
        source="actor.email",
        read_only=True,
        allow_null=True,
    )

    action_display = serializers.CharField(
        source="get_action_display",
        read_only=True,
    )

    content_type_name = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = [
            "id",
            "actor",
            "actor_email",
            "action",
            "action_display",
            "description",
            "content_type",
            "content_type_name",
            "object_id",
            "object_repr",
            "changes",
            "metadata",
            "ip_address",
            "user_agent",
            "created_at",
        ]
        read_only_fields = fields

    def get_content_type_name(self, obj):
        if obj.content_type:
            return obj.content_type.model
        return None