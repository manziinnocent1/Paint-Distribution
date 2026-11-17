from rest_framework.permissions import BasePermission, SAFE_METHODS


def is_catalog_manager(user):
    if not user or not user.is_authenticated or not user.is_active:
        return False

    return (
        getattr(user, "is_superuser", False)
        or getattr(user, "is_staff", False)
        or getattr(user, "is_admin", False)
        or getattr(user, "role", None) in {"admin", "manager"}
    )


class IsCatalogViewer(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_active
        )


class IsCatalogManagerOrReadOnly(BasePermission):
    message = "You need manager or administrator permissions to modify the catalog."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return bool(
                request.user
                and request.user.is_authenticated
                and request.user.is_active
            )

        return is_catalog_manager(request.user)