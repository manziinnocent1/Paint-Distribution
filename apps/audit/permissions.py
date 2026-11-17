from rest_framework.permissions import BasePermission


def is_audit_manager(user):
    if not user or not user.is_authenticated or not user.is_active:
        return False

    return (
        getattr(user, "is_superuser", False)
        or getattr(user, "is_staff", False)
        or getattr(user, "is_admin", False)
        or getattr(user, "role", None) in {"admin", "manager"}
    )


class IsAuditManager(BasePermission):
    message = "You do not have permission to access audit logs."

    def has_permission(self, request, view):
        return is_audit_manager(request.user)