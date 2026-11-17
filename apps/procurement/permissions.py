from rest_framework.permissions import BasePermission, SAFE_METHODS


READ_ROLES = {
    "admin",
    "manager",
    "procurement_officer",
    "inventory_manager",
    "storekeeper",
    "accountant",
}

PROCUREMENT_ROLES = {
    "admin",
    "manager",
    "procurement_officer",
}

RECEIVING_ROLES = PROCUREMENT_ROLES | {
    "inventory_manager",
    "storekeeper",
}


class ProcurementPermission(BasePermission):

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.is_superuser or getattr(user, "is_admin", False):
            return True

        if request.method in SAFE_METHODS:
            return user.role in READ_ROLES

        action = getattr(view, "action", None)

        if action in {"receive", "confirm_receipt"}:
            return user.role in RECEIVING_ROLES

        return user.role in PROCUREMENT_ROLES