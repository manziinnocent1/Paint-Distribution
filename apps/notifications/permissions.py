
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsNotificationOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.recipient_id == request.user.id


class IsActiveUser(BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_active
        )
