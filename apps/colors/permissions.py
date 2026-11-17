from rest_framework.permissions import BasePermission, SAFE_METHODS


def is_business_manager(user):
    if not user or not user.is_authenticated or not user.is_active:
        return False

    return (
        getattr(user, "is_superuser", False)
        or getattr(user, "is_staff", False)
        or getattr(user, "is_admin", False)
        or getattr(user, "role", None) in {"admin", "manager"}
    )


class IsColorManagerOrReadOnly(BasePermission):
    message = "Only managers and administrators can modify colours."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return bool(
                request.user
                and request.user.is_authenticated
                and request.user.is_active
            )

        return is_business_manager(request.user)


class IsFormulaManager(BasePermission):
    message = "Only managers and administrators can access mixing formulas."

    def has_permission(self, request, view):
        return is_business_manager(request.user)