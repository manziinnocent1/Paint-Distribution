
from rest_framework.permissions import BasePermission, SAFE_METHODS


PAYMENT_MANAGER_ROLES = {
    "admin",
    "manager",
    "accountant",
}

PAYMENT_STAFF_ROLES = PAYMENT_MANAGER_ROLES | {
    "sales_manager",
    "sales_person",
}


class IsPaymentStaff(BasePermission):

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated or not user.is_active:
            return False

        if user.is_superuser or user.is_admin:
            return True

        if request.method in SAFE_METHODS:
            return user.role in PAYMENT_STAFF_ROLES

        return user.role in PAYMENT_STAFF_ROLES


class IsPaymentManager(BasePermission):

    def has_permission(self, request, view):
        user = request.user

        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and (
                user.is_superuser
                or user.is_admin
                or user.role in PAYMENT_MANAGER_ROLES
            )
        )
