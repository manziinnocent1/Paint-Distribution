from rest_framework.permissions import BasePermission, SAFE_METHODS


READ_ROLES = {
    "admin",
    "manager",
    "sales_manager",
    "sales_person",
    "accountant",
    "inventory_manager",
    "storekeeper",
}

SALES_ROLES = {
    "admin",
    "manager",
    "sales_manager",
    "sales_person",
}

FULFILMENT_ROLES = {
    "admin",
    "manager",
    "sales_manager",
    "inventory_manager",
    "storekeeper",
}


class SalesPermission(BasePermission):

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.is_superuser or getattr(user, "is_admin", False):
            return True

        if request.method in SAFE_METHODS:
            return user.role in READ_ROLES

        action = getattr(view, "action", None)

        if action in {
            "fulfill",
            "approve_return",
            "receive_return",
        }:
            return user.role in FULFILMENT_ROLES

        return user.role in SALES_ROLES