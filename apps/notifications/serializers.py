
from django.utils import timezone
from rest_framework import serializers

from .models import Notification, NotificationPreference


class NotificationSerializer(serializers.ModelSerializer):
    recipient_email = serializers.EmailField(
        source="recipient.email",
        read_only=True,
    )

    class Meta:
        model = Notification
        fields = [
            "id",
            "recipient",
            "recipient_email",
            "customer",
            "notification_type",
            "priority",
            "title",
            "message",
            "reference_type",
            "reference_id",
            "action_url",
            "is_read",
            "read_at",
            "created_at",
        ]
        read_only_fields = fields


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = [
            "id",
            "in_app_enabled",
            "email_enabled",
            "sms_enabled",
            "order_updates",
            "payment_updates",
            "delivery_updates",
            "inventory_updates",
            "system_updates",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
