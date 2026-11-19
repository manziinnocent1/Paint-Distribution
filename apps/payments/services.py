
import uuid
from decimal import Decimal

from django.db import models

from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError

from .models import Payment, PaymentRefund


def create_payment(data, user):
    payment_number = f"PAY-{uuid.uuid4().hex[:12].upper()}"

    return Payment.objects.create(
        payment_number=payment_number,
        initiated_by=user,
        **data,
    )


@transaction.atomic
def confirm_payment(payment_id, user, transaction_reference=""):
    payment = Payment.objects.select_for_update().get(pk=payment_id)

    if payment.status == Payment.Status.COMPLETED:
        return payment

    if payment.status not in {
        Payment.Status.PENDING,
        Payment.Status.PROCESSING,
    }:
        raise ValidationError("Only pending or processing payments can be confirmed.")

    payment.status = Payment.Status.COMPLETED
    payment.confirmed_by = user
    payment.paid_at = timezone.now()

    if transaction_reference:
        payment.transaction_reference = transaction_reference

    payment.save(update_fields=[
        "status",
        "confirmed_by",
        "paid_at",
        "transaction_reference",
        "updated_at",
    ])

    return payment


@transaction.atomic
def fail_payment(payment_id):
    payment = Payment.objects.select_for_update().get(pk=payment_id)

    if payment.status not in {
        Payment.Status.PENDING,
        Payment.Status.PROCESSING,
    }:
        raise ValidationError("This payment cannot be marked as failed.")

    payment.status = Payment.Status.FAILED
    payment.save(update_fields=["status", "updated_at"])

    return payment


@transaction.atomic
def create_refund(payment_id, amount, reason, user):
    payment = Payment.objects.select_for_update().get(pk=payment_id)

    if payment.status not in {
        Payment.Status.COMPLETED,
        Payment.Status.PARTIALLY_REFUNDED,
    }:
        raise ValidationError("Only completed payments can be refunded.")

    amount = Decimal(str(amount))

    if amount <= 0:
        raise ValidationError("Refund amount must be greater than zero.")

    already_refunded = payment.refunds.filter(
        status__in=[
            PaymentRefund.Status.PENDING,
            PaymentRefund.Status.COMPLETED,
        ]
    ).aggregate(total=models.Sum("amount"))["total"] or Decimal("0")

    if already_refunded + amount > payment.amount:
        raise ValidationError("The refund exceeds the refundable payment balance.")

    refund = PaymentRefund.objects.create(
        payment=payment,
        refund_number=f"REF-{uuid.uuid4().hex[:12].upper()}",
        amount=amount,
        reason=reason,
        processed_by=user,
    )

    return refund


@transaction.atomic
def complete_refund(refund_id, user):
    refund = PaymentRefund.objects.select_for_update().select_related(
        "payment"
    ).get(pk=refund_id)

    if refund.status == PaymentRefund.Status.COMPLETED:
        return refund

    if refund.status != PaymentRefund.Status.PENDING:
        raise ValidationError("Only pending refunds can be completed.")

    payment = Payment.objects.select_for_update().get(
        pk=refund.payment_id
    )

    refund.status = PaymentRefund.Status.COMPLETED
    refund.processed_by = user
    refund.processed_at = timezone.now()
    refund.save()

    completed_total = payment.refunds.filter(
        status=PaymentRefund.Status.COMPLETED
    ).aggregate(total=models.Sum("amount"))["total"] or Decimal("0")

    if completed_total >= payment.amount:
        payment.status = Payment.Status.REFUNDED
    else:
        payment.status = Payment.Status.PARTIALLY_REFUNDED

    payment.save(update_fields=["status", "updated_at"])

    return refund
