from rest_framework.permissions import BasePermission, SAFE_METHODS


def is_delivery_manager(user):
    if not user or not user.is_authenticated or not user.is_active:
        return False

    return (
        getattr(user, "is_superuser", False)
        or getattr(user, "is_staff", False)
        or getattr(user, "is_admin", False)
        or getattr(user, "role", None) in {"admin", "manager"}
    )


class IsDeliveryStaffOrReadOnly(BasePermission):
    message = "You do not have permission to modify delivery records."

    def has_permission(self, request, view):
        if not (
            request.user
            and request.user.is_authenticated
            and request.user.is_active
        ):
            return False

        if request.method in SAFE_METHODS:
            return True

        return (
            is_delivery_manager(request.user)
            or getattr(request.user, "role", None) == "sales_person"
        )