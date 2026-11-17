from rest_framework import serializers

from apps.expenses.models import ExpenseCategory, Expense


class ExpenseCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = ExpenseCategory
        fields = [
            "id",
            "name",
            "code",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


class ExpenseSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    created_by_email = serializers.CharField(
        source="created_by.email",
        read_only=True,
        allow_null=True,
    )

    approved_by_email = serializers.CharField(
        source="approved_by.email",
        read_only=True,
        allow_null=True,
    )

    paid_by_email = serializers.CharField(
        source="paid_by.email",
        read_only=True,
        allow_null=True,
    )

    total_amount = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Expense
        fields = [
            "id",
            "expense_number",
            "category",
            "category_name",
            "title",
            "description",
            "supplier_name",
            "supplier_reference",
            "amount",
            "tax_amount",
            "total_amount",
            "currency",
            "expense_date",
            "due_date",
            "payment_date",
            "payment_method",
            "payment_reference",
            "receipt",
            "status",
            "submitted_at",
            "approved_at",
            "paid_at",
            "rejection_reason",
            "notes",
            "created_by",
            "created_by_email",
            "approved_by",
            "approved_by_email",
            "paid_by",
            "paid_by_email",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "expense_number",
            "status",
            "submitted_at",
            "approved_at",
            "paid_at",
            "created_by",
            "approved_by",
            "paid_by",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        amount = attrs.get(
            "amount",
            getattr(self.instance, "amount", None),
        )

        tax_amount = attrs.get(
            "tax_amount",
            getattr(self.instance, "tax_amount", 0),
        )

        if amount is not None and amount <= 0:
            raise serializers.ValidationError({
                "amount": "Expense amount must be greater than zero."
            })

        if tax_amount is not None and tax_amount < 0:
            raise serializers.ValidationError({
                "tax_amount": "Tax amount cannot be negative."
            })

        return attrs


class ExpenseActionSerializer(serializers.Serializer):

    note = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    rejection_reason = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    payment_method = serializers.ChoiceField(
        choices=Expense.PaymentMethod.choices,
        required=False,
    )

    payment_reference = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    payment_date = serializers.DateField(required=False)