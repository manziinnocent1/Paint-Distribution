
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from django.utils import timezone

from rest_framework import status
from rest_framework.test import APIClient

from apps.notifications.models import (
    Notification,
    NotificationPreference,
)


User = get_user_model()


class NotificationViewSetTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email="user@example.com",
            password="TestPassword123!",
            role="manager",
        )

        self.other_user = User.objects.create_user(
            email="other@example.com",
            password="TestPassword123!",
            role="manager",
        )

        self.inactive_user = User.objects.create_user(
            email="inactive@example.com",
            password="TestPassword123!",
            role="manager",
            is_active=False,
        )

        self.notification = self.create_notification(
            recipient=self.user,
            title="New order received",
            notification_type=Notification.NotificationType.ORDER,
        )

        self.read_notification = self.create_notification(
            recipient=self.user,
            title="Payment received",
            notification_type=Notification.NotificationType.PAYMENT,
            is_read=True,
            read_at=timezone.now(),
        )

        self.other_notification = self.create_notification(
            recipient=self.other_user,
            title="Other user's notification",
        )

        self.client.force_authenticate(user=self.user)

    def create_notification(self, **kwargs):
        data = {
            "recipient": self.user,
            "title": "Test notification",
            "message": "This is a test notification.",
        }
        data.update(kwargs)

        return Notification.objects.create(**data)

    def get_results(self, response):
        if isinstance(response.data, dict) and "results" in response.data:
            return response.data["results"]

        return response.data

    def notification_detail_url(self, notification):
        return reverse(
            "notifications-detail",
            kwargs={"pk": notification.pk},
        )

    # ---------------------------------------------------------
    # Authentication and permissions
    # ---------------------------------------------------------

    def test_unauthenticated_user_cannot_list_notifications(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(
            reverse("notifications-list")
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_inactive_user_cannot_list_notifications(self):
        self.client.force_authenticate(user=self.inactive_user)

        response = self.client.get(
            reverse("notifications-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_authenticated_user_can_list_notifications(self):
        response = self.client.get(
            reverse("notifications-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # ---------------------------------------------------------
    # List and retrieve notifications
    # ---------------------------------------------------------

    def test_list_returns_only_current_user_notifications(self):
        response = self.client.get(
            reverse("notifications-list")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        notifications = self.get_results(response)

        notification_ids = [
            str(item["id"])
            for item in notifications
        ]

        self.assertIn(
            str(self.notification.pk),
            notification_ids,
        )

        self.assertIn(
            str(self.read_notification.pk),
            notification_ids,
        )

        self.assertNotIn(
            str(self.other_notification.pk),
            notification_ids,
        )

    def test_retrieve_own_notification(self):
        response = self.client.get(
            self.notification_detail_url(self.notification)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(
            response.data["title"],
            "New order received",
        )

    def test_cannot_retrieve_another_users_notification(self):
        response = self.client.get(
            self.notification_detail_url(self.other_notification)
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_notifications_are_read_only(self):
        response = self.client.post(
            reverse("notifications-list"),
            {
                "title": "Attempted notification",
                "message": "This should not be created.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def test_cannot_update_notification_directly(self):
        response = self.client.patch(
            self.notification_detail_url(self.notification),
            {
                "is_read": True,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def test_cannot_delete_notification(self):
        response = self.client.delete(
            self.notification_detail_url(self.notification)
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    # ---------------------------------------------------------
    # Unread notifications
    # ---------------------------------------------------------

    def test_get_unread_notifications(self):
        response = self.client.get(
            reverse("notifications-unread")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        notifications = self.get_results(response)

        notification_ids = [
            str(item["id"])
            for item in notifications
        ]

        self.assertIn(
            str(self.notification.pk),
            notification_ids,
        )

        self.assertNotIn(
            str(self.read_notification.pk),
            notification_ids,
        )

        self.assertNotIn(
            str(self.other_notification.pk),
            notification_ids,
        )

    def test_unread_endpoint_returns_empty_list_when_all_are_read(self):
        self.notification.is_read = True
        self.notification.read_at = timezone.now()
        self.notification.save(
            update_fields=["is_read", "read_at"]
        )

        response = self.client.get(
            reverse("notifications-unread")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.get_results(response), [])

    def test_unread_endpoint_requires_authentication(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(
            reverse("notifications-unread")
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    # ---------------------------------------------------------
    # Unread count
    # ---------------------------------------------------------

    def test_get_unread_notification_count(self):
        response = self.client.get(
            reverse("notifications-unread-count")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["unread_count"], 1)

    def test_unread_count_excludes_other_users_notifications(self):
        response = self.client.get(
            reverse("notifications-unread-count")
        )

        self.assertEqual(response.data["unread_count"], 1)

    def test_unread_count_is_zero_when_all_notifications_are_read(self):
        self.notification.is_read = True
        self.notification.read_at = timezone.now()
        self.notification.save(
            update_fields=["is_read", "read_at"]
        )

        response = self.client.get(
            reverse("notifications-unread-count")
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["unread_count"], 0)

    # ---------------------------------------------------------
    # Mark one notification as read
    # ---------------------------------------------------------

    def test_mark_notification_as_read(self):
        response = self.client.post(
            reverse(
                "notifications-mark-read",
                kwargs={"pk": self.notification.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.notification.refresh_from_db()

        self.assertTrue(self.notification.is_read)
        self.assertIsNotNone(self.notification.read_at)

    def test_mark_read_does_not_change_already_read_notification(self):
        original_read_at = self.read_notification.read_at

        response = self.client.post(
            reverse(
                "notifications-mark-read",
                kwargs={"pk": self.read_notification.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.read_notification.refresh_from_db()

        self.assertTrue(self.read_notification.is_read)
        self.assertEqual(
            self.read_notification.read_at,
            original_read_at,
        )

    def test_cannot_mark_another_users_notification_as_read(self):
        response = self.client.post(
            reverse(
                "notifications-mark-read",
                kwargs={"pk": self.other_notification.pk},
            ),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        self.other_notification.refresh_from_db()

        self.assertFalse(self.other_notification.is_read)

    # ---------------------------------------------------------
    # Mark all notifications as read
    # ---------------------------------------------------------

    def test_mark_all_notifications_as_read(self):
        response = self.client.post(
            reverse("notifications-mark-all-read"),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(
            response.data["message"],
            "All notifications marked as read.",
        )

        self.notification.refresh_from_db()
        self.read_notification.refresh_from_db()

        self.assertTrue(self.notification.is_read)
        self.assertIsNotNone(self.notification.read_at)

        self.assertTrue(self.read_notification.is_read)

    def test_mark_all_read_does_not_change_other_users_notifications(self):
        response = self.client.post(
            reverse("notifications-mark-all-read"),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.other_notification.refresh_from_db()

        self.assertFalse(self.other_notification.is_read)

    def test_mark_all_read_when_no_unread_notifications_exist(self):
        self.notification.is_read = True
        self.notification.read_at = timezone.now()
        self.notification.save(
            update_fields=["is_read", "read_at"]
        )

        response = self.client.post(
            reverse("notifications-mark-all-read"),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class NotificationPreferenceViewSetTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email="preferences@example.com",
            password="TestPassword123!",
            role="manager",
        )

        self.other_user = User.objects.create_user(
            email="other-preferences@example.com",
            password="TestPassword123!",
            role="manager",
        )

        self.inactive_user = User.objects.create_user(
            email="inactive-preferences@example.com",
            password="TestPassword123!",
            role="manager",
            is_active=False,
        )

        self.client.force_authenticate(user=self.user)

    def get_preferences_url(self):
        return reverse("notification-preferences-list")

    def get_preferences_detail_url(self):
        return reverse(
            "notification-preferences-detail",
            kwargs={"pk": "00000000-0000-0000-0000-000000000001"},
        )

    # ---------------------------------------------------------
    # Authentication
    # ---------------------------------------------------------

    def test_unauthenticated_user_cannot_access_preferences(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(
            self.get_preferences_url()
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_inactive_user_cannot_access_preferences(self):
        self.client.force_authenticate(user=self.inactive_user)

        response = self.client.get(
            self.get_preferences_url()
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    # ---------------------------------------------------------
    # Retrieve preferences
    # ---------------------------------------------------------

    def test_get_preferences(self):
        response = self.client.get(
            self.get_preferences_url()
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertTrue(response.data["in_app_enabled"])
        self.assertFalse(response.data["email_enabled"])
        self.assertFalse(response.data["sms_enabled"])

    def test_get_preferences_creates_default_preferences(self):
        self.assertFalse(
            NotificationPreference.objects.filter(
                user=self.user
            ).exists()
        )

        response = self.client.get(
            self.get_preferences_url()
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertTrue(
            NotificationPreference.objects.filter(
                user=self.user
            ).exists()
        )

    def test_user_receives_only_their_own_preferences(self):
        self.client.get(self.get_preferences_url())

        other_preferences = NotificationPreference.objects.create(
            user=self.other_user,
            email_enabled=True,
            sms_enabled=True,
        )

        response = self.client.get(
            self.get_preferences_url()
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(
            response.data["id"],
            str(
                NotificationPreference.objects.get(
                    user=self.user
                ).pk
            ),
        )

        self.assertNotEqual(
            response.data["id"],
            str(other_preferences.pk),
        )

    # ---------------------------------------------------------
    # Update preferences
    # ---------------------------------------------------------

    def test_update_preferences(self):
        response = self.client.patch(
            self.get_preferences_detail_url(),
            {
                "in_app_enabled": False,
                "email_enabled": True,
                "sms_enabled": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        preferences = NotificationPreference.objects.get(
            user=self.user
        )

        self.assertFalse(preferences.in_app_enabled)
        self.assertTrue(preferences.email_enabled)
        self.assertTrue(preferences.sms_enabled)

    def test_update_individual_notification_preference(self):
        response = self.client.patch(
            self.get_preferences_detail_url(),
            {
                "order_updates": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        preferences = NotificationPreference.objects.get(
            user=self.user
        )

        self.assertFalse(preferences.order_updates)
        self.assertTrue(preferences.payment_updates)
        self.assertTrue(preferences.delivery_updates)

    def test_update_multiple_notification_preferences(self):
        response = self.client.patch(
            self.get_preferences_detail_url(),
            {
                "order_updates": False,
                "payment_updates": False,
                "delivery_updates": False,
                "inventory_updates": False,
                "system_updates": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        preferences = NotificationPreference.objects.get(
            user=self.user
        )

        self.assertFalse(preferences.order_updates)
        self.assertFalse(preferences.payment_updates)
        self.assertFalse(preferences.delivery_updates)
        self.assertFalse(preferences.inventory_updates)
        self.assertFalse(preferences.system_updates)

    def test_update_preferences_creates_default_record_if_missing(self):
        self.assertFalse(
            NotificationPreference.objects.filter(
                user=self.user
            ).exists()
        )

        response = self.client.patch(
            self.get_preferences_detail_url(),
            {
                "email_enabled": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        preferences = NotificationPreference.objects.get(
            user=self.user
        )

        self.assertTrue(preferences.email_enabled)
        self.assertTrue(preferences.in_app_enabled)

    def test_cannot_update_another_users_preferences(self):
        other_preferences = NotificationPreference.objects.create(
            user=self.other_user,
            email_enabled=False,
        )

        response = self.client.patch(
            reverse(
                "notification-preferences-detail",
                kwargs={"pk": other_preferences.pk},
            ),
            {
                "email_enabled": True,
            },
            format="json",
        )

        # The view uses the authenticated user's preferences,
        # rather than the supplied URL primary key.
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        other_preferences.refresh_from_db()

        self.assertFalse(other_preferences.email_enabled)

        own_preferences = NotificationPreference.objects.get(
            user=self.user
        )

        self.assertTrue(own_preferences.email_enabled)

    def test_preference_list_does_not_support_post(self):
        response = self.client.post(
            self.get_preferences_url(),
            {
                "email_enabled": True,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )
