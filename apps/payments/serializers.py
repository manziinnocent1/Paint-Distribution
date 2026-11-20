from decimal import Decimal

from rest_framework import serializers

from .models import Payment, PaymentRefund


class PaymentSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.__str__",
        read_only=True,
    )

    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = [
            "id",
            "payment_number",
            "status",
            "initiated_by",
            "confirmed_by",
            "paid_at",
            "provider_response",
            "created_at",
            "updated_at",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Payment amount must be greater than zero."
            )
        return value


class PaymentRefundSerializer(serializers.ModelSerializer):

    class Meta:
        model = PaymentRefund
        fields = "__all__"
        read_only_fields = [
            "id",
            "refund_number",
            "status",
            "processed_by",
            "processed_at",
            "created_at",
        ]


class RefundCreateSerializer(serializers.Serializer):
    amount = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        min_value=Decimal("0.01"),
    )
    reason = serializers.CharField()
