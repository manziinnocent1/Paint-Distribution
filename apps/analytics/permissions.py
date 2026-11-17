
from rest_framework.permissions import BasePermission


class IsAnalyticsViewer(BasePermission):

    message = (
        "You do not have permission to access business analytics."
    )

    allowed_roles = [
        "admin",
        "manager",
        "accountant",
    ]

    def has_permission(self, request, view):

        user = request.user

        if not user or not user.is_authenticated:
            return False

        if not user.is_active:
            return False

        return (
            user.is_admin
            or user.role in self.allowed_roles
        )


class IsAnalyticsManager(BasePermission):

    message = (
        "Business manager or administrator access is required."
    )

    allowed_roles = [
        "manager",
    ]

    def has_permission(self, request, view):

        user = request.user

        if not user or not user.is_authenticated:
            return False

        if not user.is_active:
            return False

        return (
            user.is_admin
            or user.role in self.allowed_roles
        )
