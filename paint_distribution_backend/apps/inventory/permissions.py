from rest_framework.permissions import BasePermission, SAFE_METHODS


def is_active_user(user):
    return bool(
        user
        and user.is_authenticated
        and user.is_active
    )


def is_inventory_manager(user):
    if not is_active_user(user):
        return False

    return (
        getattr(user, "is_superuser", False)
        or getattr(user, "is_staff", False)
        or getattr(user, "is_admin", False)
        or getattr(user, "role", None) in {
            "admin",
            "manager",
        }
    )


class IsInventoryStaffOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        if not is_active_user(request.user):
            return False

        if request.method in SAFE_METHODS:
            return True

        return is_inventory_manager(request.user)


class IsInventoryManager(BasePermission):

    def has_permission(self, request, view):
        return is_inventory_manager(request.user)