
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsPricingStaff(BasePermission):

    ALLOWED_ROLES = {
        "admin",
        "manager",
        "sales_manager",
        "accountant",
    }

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated or not user.is_active:
            return False

        if user.is_superuser or user.is_admin:
            return True

        if request.method in SAFE_METHODS:
            return True

        return user.role in self.ALLOWED_ROLES
