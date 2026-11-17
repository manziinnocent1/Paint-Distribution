from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from apps.expenses.models import ExpenseCategory, Expense
from apps.expenses.serializers import (
    ExpenseCategorySerializer,
    ExpenseSerializer,
    ExpenseActionSerializer,
)
from apps.expenses.permissions import IsExpenseStaff, is_expense_manager
from apps.expenses.filters import ExpenseFilter
from apps.expenses import services


def run_service(function, **kwargs):
    try:
        return function(**kwargs)
    except DjangoValidationError as exc:
        raise ValidationError(exc.messages)


class ExpenseCategoryViewSet(viewsets.ModelViewSet):

    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsExpenseStaff]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ["is_active"]
    search_fields = ["name", "code", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]


class ExpenseViewSet(viewsets.ModelViewSet):

    queryset = Expense.objects.select_related(
        "category",
        "created_by",
        "approved_by",
        "paid_by",
    )

    serializer_class = ExpenseSerializer
    permission_classes = [IsExpenseStaff]
    filterset_class = ExpenseFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "expense_number",
        "title",
        "description",
        "supplier_name",
        "supplier_reference",
        "payment_reference",
    ]

    ordering_fields = [
        "expense_date",
        "amount",
        "created_at",
        "status",
    ]

    ordering = ["-expense_date"]

    def perform_create(self, serializer):
        data = serializer.validated_data
        expense = services.create_expense(
            data=data,
            user=self.request.user,
        )
        serializer.instance = expense

    def get_action_serializer(self, request):
        serializer = ExpenseActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        expense = self.get_object()

        expense = run_service(
            services.submit_expense,
            expense=expense,
            user=request.user,
        )

        return Response(self.get_serializer(expense).data)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        if not is_expense_manager(request.user):
            return Response(
                {"detail": "Only authorized expense managers can approve expenses."},
                status=status.HTTP_403_FORBIDDEN,
            )

        expense = run_service(
            services.approve_expense,
            expense=self.get_object(),
            user=request.user,
        )

        return Response(self.get_serializer(expense).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        if not is_expense_manager(request.user):
            return Response(
                {"detail": "Only authorized expense managers can reject expenses."},
                status=status.HTTP_403_FORBIDDEN,
            )

        data = self.get_action_serializer(request)

        expense = run_service(
            services.reject_expense,
            expense=self.get_object(),
            user=request.user,
            reason=data.get("rejection_reason", ""),
        )

        return Response(self.get_serializer(expense).data)

    @action(detail=True, methods=["post"])
    def mark_paid(self, request, pk=None):
        if not is_expense_manager(request.user):
            return Response(
                {"detail": "Only authorized expense managers can mark expenses as paid."},
                status=status.HTTP_403_FORBIDDEN,
            )

        data = self.get_action_serializer(request)

        payment_method = data.get("payment_method")

        if not payment_method:
            raise ValidationError({
                "payment_method": "This field is required."
            })

        expense = run_service(
            services.mark_expense_paid,
            expense=self.get_object(),
            user=request.user,
            payment_method=payment_method,
            payment_reference=data.get("payment_reference", ""),
            payment_date=data.get("payment_date"),
        )

        return Response(self.get_serializer(expense).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        expense = run_service(
            services.cancel_expense,
            expense=self.get_object(),
        )

        return Response(self.get_serializer(expense).data)