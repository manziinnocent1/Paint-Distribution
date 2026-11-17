from rest_framework.permissions import BasePermission, SAFE_METHODS


MANAGEMENT_ROLES = {
    "admin",
    "manager",
    "procurement_officer",
}

SUPPLIER_VIEW_ROLES = MANAGEMENT_ROLES | {
    "inventory_manager",
    "accountant",
    "sales_manager",
    "sales_person",
}


class SupplierPermission(BasePermission):
    """
    Controls access to supplier records.

    Read access:
        Admin, manager, procurement, inventory, accounting and sales staff.

    Write access:
        Admin, manager and procurement officers.
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.is_superuser or getattr(user, "is_admin", False):
            return True

        if request.method in SAFE_METHODS:
            return user.role in SUPPLIER_VIEW_ROLES

        return user.role in MANAGEMENT_ROLES