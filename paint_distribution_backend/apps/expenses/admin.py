from django.contrib import admin

from apps.expenses.models import ExpenseCategory, Expense


@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):

    list_display = [
        "name",
        "code",
        "is_active",
        "created_at",
    ]

    list_filter = ["is_active"]
    search_fields = ["name", "code"]


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):

    list_display = [
        "expense_number",
        "title",
        "category",
        "amount",
        "tax_amount",
        "currency",
        "status",
        "expense_date",
    ]

    list_filter = [
        "status",
        "category",
        "payment_method",
        "currency",
        "expense_date",
    ]

    search_fields = [
        "expense_number",
        "title",
        "supplier_name",
        "supplier_reference",
    ]

    readonly_fields = [
        "expense_number",
        "submitted_at",
        "approved_at",
        "paid_at",
        "created_at",
        "updated_at",
    ]