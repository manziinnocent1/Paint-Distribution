
from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.notifications.models import (
    Notification,
    NotificationPreference,
)
from apps.notifications.serializers import (
    NotificationSerializer,
    NotificationPreferenceSerializer,
)


User = get_user_model()


class NotificationSerializerTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="recipient@example.com",
            password="TestPassword123!",
            role="manager",
        )

        self.notification = Notification.objects.create(
            recipient=self.user,
            notification_type=Notification.NotificationType.ORDER,
            priority=Notification.Priority.HIGH,
            title="New order",
            message="A new order has been received.",
            reference_type="ORDER",
            reference_id="ORD-001",
            action_url="/orders/ORD-001/",
        )

    def test_serializes_notification_fields(self):
        serializer = NotificationSerializer(self.notification)

        self.assertEqual(
            serializer.data["recipient_email"],
            "recipient@example.com",
        )
        self.assertEqual(
            serializer.data["notification_type"],
            Notification.NotificationType.ORDER,
        )
        self.assertEqual(
            serializer.data["priority"],
            Notification.Priority.HIGH,
        )
        self.assertEqual(serializer.data["title"], "New order")
        self.assertEqual(
            serializer.data["message"],
            "A new order has been received.",
        )
        self.assertEqual(
            serializer.data["reference_type"],
            "ORDER",
        )
        self.assertEqual(
            serializer.data["reference_id"],
            "ORD-001",
        )
        self.assertEqual(
            serializer.data["action_url"],
            "/orders/ORD-001/",
        )

    def test_notification_serializer_contains_expected_fields(self):
        serializer = NotificationSerializer(self.notification)

        expected_fields = [
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

        self.assertEqual(
            list(serializer.data.keys()),
            expected_fields,
        )

    def test_all_notification_fields_are_read_only(self):
        serializer = NotificationSerializer()

        for field_name, field in serializer.fields.items():
            with self.subTest(field=field_name):
                self.assertTrue(
                    field.read_only,
                    f"{field_name} should be read-only.",
                )

    def test_notification_serializer_does_not_accept_write_data(self):
        serializer = NotificationSerializer(
            data={
                "title": "Attempted notification",
                "message": "This should not create a notification.",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data, {})


class NotificationPreferenceSerializerTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="preferences@example.com",
            password="TestPassword123!",
            role="manager",
        )

        self.preferences = NotificationPreference.objects.create(
            user=self.user,
        )

    def test_serializes_preference_fields(self):
        serializer = NotificationPreferenceSerializer(
            self.preferences
        )

        self.assertTrue(serializer.data["in_app_enabled"])
        self.assertFalse(serializer.data["email_enabled"])
        self.assertFalse(serializer.data["sms_enabled"])
        self.assertTrue(serializer.data["order_updates"])
        self.assertTrue(serializer.data["payment_updates"])
        self.assertTrue(serializer.data["delivery_updates"])
        self.assertTrue(serializer.data["inventory_updates"])
        self.assertTrue(serializer.data["system_updates"])

    def test_preference_serializer_contains_expected_fields(self):
        serializer = NotificationPreferenceSerializer(
            self.preferences
        )

        expected_fields = [
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

        self.assertEqual(
            list(serializer.data.keys()),
            expected_fields,
        )

    def test_preference_id_and_timestamps_are_read_only(self):
        serializer = NotificationPreferenceSerializer()

        self.assertTrue(serializer.fields["id"].read_only)
        self.assertTrue(serializer.fields["created_at"].read_only)
        self.assertTrue(serializer.fields["updated_at"].read_only)

    def test_can_update_notification_preferences(self):
        serializer = NotificationPreferenceSerializer(
            self.preferences,
            data={
                "in_app_enabled": False,
                "email_enabled": True,
                "sms_enabled": True,
                "order_updates": False,
                "payment_updates": True,
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_preferences = serializer.save()

        self.assertFalse(updated_preferences.in_app_enabled)
        self.assertTrue(updated_preferences.email_enabled)
        self.assertTrue(updated_preferences.sms_enabled)
        self.assertFalse(updated_preferences.order_updates)
        self.assertTrue(updated_preferences.payment_updates)

    def test_can_update_individual_preference(self):
        serializer = NotificationPreferenceSerializer(
            self.preferences,
            data={
                "delivery_updates": False,
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_preferences = serializer.save()

        self.assertFalse(updated_preferences.delivery_updates)
        self.assertTrue(updated_preferences.order_updates)
        self.assertTrue(updated_preferences.payment_updates)

    def test_cannot_change_preference_id(self):
        original_id = self.preferences.pk

        serializer = NotificationPreferenceSerializer(
            self.preferences,
            data={
                "id": "00000000-0000-0000-0000-000000000001",
                "email_enabled": True,
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_preferences = serializer.save()

        self.assertEqual(updated_preferences.pk, original_id)
