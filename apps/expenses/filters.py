import django_filters

from apps.expenses.models import Expense


class ExpenseFilter(django_filters.FilterSet):

    expense_date_from = django_filters.DateFilter(
        field_name="expense_date",
        lookup_expr="gte",
    )

    expense_date_to = django_filters.DateFilter(
        field_name="expense_date",
        lookup_expr="lte",
    )

    min_amount = django_filters.NumberFilter(
        field_name="amount",
        lookup_expr="gte",
    )

    max_amount = django_filters.NumberFilter(
        field_name="amount",
        lookup_expr="lte",
    )

    class Meta:
        model = Expense
        fields = [
            "category",
            "status",
            "payment_method",
            "currency",
            "created_by",
            "expense_date_from",
            "expense_date_to",
            "min_amount",
            "max_amount",
        ]