
from rest_framework.permissions import BasePermission


class IsBusinessAdmin(BasePermission):
    """
    Only administrators can access the resource.
    """

    message = "Administrator access is required."

    def has_permission(self, request, view):
        user = request.user

        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and user.is_admin
        )


class IsOwnerOrBusinessAdmin(BasePermission):
    """
    Allows users to access their own records.
    Administrators can access all records.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_active
        )

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if request.user.is_admin:
            return True

        return getattr(obj, "id", None) == request.user.id


class HasAnyRole(BasePermission):
    """
    Restricts access to specified employee roles.

    Usage:
        permission_classes = [HasAnyRole]
        allowed_roles = ["manager", "accountant"]
    """

    message = "You do not have permission for this operation."

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if not user.is_active:
            return False

        if user.is_admin:
            return True

        allowed_roles = getattr(
            view,
            "allowed_roles",
            [],
        )

        return user.role in allowed_roles
