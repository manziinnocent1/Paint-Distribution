
import uuid

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.notifications.models import (
    Notification,
    NotificationPreference,
)


User = get_user_model()


class NotificationModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            password="TestPassword123!",
            role="manager",
        )

    def create_notification(self, **kwargs):
        data = {
            "recipient": self.user,
            "title": "New order received",
            "message": "A new customer order has been received.",
        }
        data.update(kwargs)

        return Notification.objects.create(**data)

    def test_notification_is_created_successfully(self):
        notification = self.create_notification()

        self.assertIsInstance(notification, Notification)
        self.assertEqual(notification.recipient, self.user)
        self.assertEqual(notification.title, "New order received")

    def test_notification_has_uuid_primary_key(self):
        notification = self.create_notification()

        self.assertIsInstance(notification.id, uuid.UUID)

    def test_notification_default_type_is_system(self):
        notification = self.create_notification()

        self.assertEqual(
            notification.notification_type,
            Notification.NotificationType.SYSTEM,
        )

    def test_notification_default_priority_is_normal(self):
        notification = self.create_notification()

        self.assertEqual(
            notification.priority,
            Notification.Priority.NORMAL,
        )

    def test_notification_is_unread_by_default(self):
        notification = self.create_notification()

        self.assertFalse(notification.is_read)
        self.assertIsNone(notification.read_at)

    def test_notification_reference_fields_default_to_empty(self):
        notification = self.create_notification()

        self.assertEqual(notification.reference_type, "")
        self.assertEqual(notification.reference_id, "")
        self.assertEqual(notification.action_url, "")

    def test_notification_can_store_reference_information(self):
        notification = self.create_notification(
            reference_type="ORDER",
            reference_id="ORD-001",
            action_url="/orders/ORD-001/",
        )

        self.assertEqual(notification.reference_type, "ORDER")
        self.assertEqual(notification.reference_id, "ORD-001")
        self.assertEqual(notification.action_url, "/orders/ORD-001/")

    def test_notification_can_have_custom_type_and_priority(self):
        notification = self.create_notification(
            notification_type=Notification.NotificationType.PAYMENT,
            priority=Notification.Priority.URGENT,
        )

        self.assertEqual(
            notification.notification_type,
            Notification.NotificationType.PAYMENT,
        )
        self.assertEqual(
            notification.priority,
            Notification.Priority.URGENT,
        )

    def test_notification_string_representation(self):
        notification = self.create_notification()

        self.assertEqual(
            str(notification),
            "New order received - user@example.com",
        )

    def test_notification_ordering_is_newest_first(self):
        first = self.create_notification(
            title="First notification",
        )

        second = self.create_notification(
            title="Second notification",
        )

        notifications = list(Notification.objects.all())

        self.assertEqual(notifications[0], second)
        self.assertEqual(notifications[1], first)

    def test_deleting_recipient_deletes_notifications(self):
        notification = self.create_notification()
        notification_id = notification.pk

        self.user.delete()

        self.assertFalse(
            Notification.objects.filter(pk=notification_id).exists()
        )


class NotificationPreferenceModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="preferences@example.com",
            password="TestPassword123!",
            role="manager",
        )

    def test_notification_preference_is_created_successfully(self):
        preferences = NotificationPreference.objects.create(
            user=self.user,
        )

        self.assertIsInstance(
            preferences,
            NotificationPreference,
        )
        self.assertEqual(preferences.user, self.user)

    def test_preference_has_uuid_primary_key(self):
        preferences = NotificationPreference.objects.create(
            user=self.user,
        )

        self.assertIsInstance(preferences.id, uuid.UUID)

    def test_default_preference_values(self):
        preferences = NotificationPreference.objects.create(
            user=self.user,
        )

        self.assertTrue(preferences.in_app_enabled)
        self.assertFalse(preferences.email_enabled)
        self.assertFalse(preferences.sms_enabled)

        self.assertTrue(preferences.order_updates)
        self.assertTrue(preferences.payment_updates)
        self.assertTrue(preferences.delivery_updates)
        self.assertTrue(preferences.inventory_updates)
        self.assertTrue(preferences.system_updates)

    def test_preferences_are_unique_per_user(self):
        NotificationPreference.objects.create(user=self.user)

        with self.assertRaises(Exception):
            NotificationPreference.objects.create(user=self.user)

    def test_preference_string_representation(self):
        preferences = NotificationPreference.objects.create(
            user=self.user,
        )

        self.assertEqual(
            str(preferences),
            "Notification preferences - preferences@example.com",
        )

    def test_deleting_user_deletes_preferences(self):
        preferences = NotificationPreference.objects.create(
            user=self.user,
        )
        preferences_id = preferences.pk

        self.user.delete()

        self.assertFalse(
            NotificationPreference.objects.filter(
                pk=preferences_id
            ).exists()
        )
