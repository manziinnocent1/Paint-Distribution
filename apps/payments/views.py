
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Sum
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from . import services
from .models import Payment, PaymentRefund
from .permissions import IsPaymentManager, IsPaymentStaff
from .serializers import (
    PaymentSerializer,
    PaymentRefundSerializer,
    RefundCreateSerializer,
)


def run_service(function, *args, **kwargs):
    try:
        return function(*args, **kwargs)
    except DjangoValidationError as exc:
        raise ValidationError(
            getattr(exc, "message_dict", None) or exc.messages
        )


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsPaymentStaff]

    queryset = Payment.objects.select_related(
        "customer",
        "initiated_by",
        "confirmed_by",
    )

    def perform_create(self, serializer):
        payment = run_service(
            services.create_payment,
            data=serializer.validated_data,
            user=self.request.user,
        )
        serializer.instance = payment

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsPaymentManager],
    )
    def confirm(self, request, pk=None):
        payment = run_service(
            services.confirm_payment,
            payment_id=pk,
            user=request.user,
            transaction_reference=request.data.get(
                "transaction_reference", ""
            ),
        )
        return Response(PaymentSerializer(payment).data)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsPaymentManager],
    )
    def fail(self, request, pk=None):
        payment = run_service(
            services.fail_payment,
            payment_id=pk,
        )
        return Response(PaymentSerializer(payment).data)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsPaymentManager],
    )
    def refund(self, request, pk=None):
        serializer = RefundCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        refund = run_service(
            services.create_refund,
            payment_id=pk,
            amount=serializer.validated_data["amount"],
            reason=serializer.validated_data["reason"],
            user=request.user,
        )

        return Response(
            PaymentRefundSerializer(refund).data,
            status=status.HTTP_201_CREATED,
        )


class PaymentRefundViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentRefundSerializer
    permission_classes = [IsPaymentManager]

    queryset = PaymentRefund.objects.select_related(
        "payment",
        "processed_by",
    )

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        refund = run_service(
            services.complete_refund,
            refund_id=pk,
            user=request.user,
        )
        return Response(PaymentRefundSerializer(refund).data)
