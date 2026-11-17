
from .models import Notification, NotificationPreference


def create_notification(
    recipient,
    title,
    message,
    notification_type=Notification.NotificationType.SYSTEM,
    priority=Notification.Priority.NORMAL,
    customer=None,
    reference_type="",
    reference_id="",
    action_url="",
):
    if not recipient or not recipient.is_active:
        return None

    preferences, _ = NotificationPreference.objects.get_or_create(
        user=recipient
    )

    if not preferences.in_app_enabled:
        return None

    preference_map = {
        Notification.NotificationType.ORDER: preferences.order_updates,
        Notification.NotificationType.PAYMENT: preferences.payment_updates,
        Notification.NotificationType.DELIVERY: preferences.delivery_updates,
        Notification.NotificationType.INVENTORY: preferences.inventory_updates,
        Notification.NotificationType.SYSTEM: preferences.system_updates,
    }

    if not preference_map.get(notification_type, True):
        return None

    return Notification.objects.create(
        recipient=recipient,
        customer=customer,
        title=title,
        message=message,
        notification_type=notification_type,
        priority=priority,
        reference_type=reference_type,
        reference_id=str(reference_id),
        action_url=action_url,
    )
