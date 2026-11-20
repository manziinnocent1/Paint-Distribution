import uuid

from django.db import transaction
from django.utils import timezone

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from apps.audit.models import AuditLog
from apps.audit.services import record_audit_event

from apps.deliveries.models import (
    Delivery,
    DeliveryStatusHistory,
)

from apps.deliveries.serializers import (
    DeliverySerializer,
    DeliveryStatusHistorySerializer,
    DeliveryStatusUpdateSerializer,
)

from apps.deliveries.permissions import IsDeliveryStaffOrReadOnly
from apps.deliveries.filters import DeliveryFilter


class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.select_related(
        "customer",
        "delivery_address",
        "assigned_driver",
        "created_by",
    ).prefetch_related(
        "status_history",
    )

    serializer_class = DeliverySerializer
    permission_classes = [IsDeliveryStaffOrReadOnly]
    filterset_class = DeliveryFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "delivery_number",
        "tracking_number",
        "order_reference",
        "customer__customer_number",
        "customer__business_name",
        "customer__first_name",
        "customer__last_name",
        "driver_name",
        "driver_phone",
    ]

    ordering_fields = [
        "created_at",
        "estimated_delivery_at",
        "delivered_at",
        "status",
    ]

    ordering = ["-created_at"]

    def audit(self, action, instance, description, changes=None):
        request = self.request

        record_audit_event(
            actor=request.user,
            action=action,
            description=description,
            instance=instance,
            changes=changes or {},
            metadata={"application": "deliveries"},
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
        )

    @transaction.atomic
    def perform_create(self, serializer):
        reference = uuid.uuid4().hex[:12].upper()

        instance = serializer.save(
            delivery_number=f"DEL-{reference}",
            tracking_number=f"TRK-{reference}",
            created_by=self.request.user,
        )

        DeliveryStatusHistory.objects.create(
            delivery=instance,
            previous_status="",
            new_status=instance.status,
            note="Delivery created.",
            updated_by=self.request.user,
        )

        self.audit(
            AuditLog.Action.CREATE,
            instance,
            f"Created delivery {instance.delivery_number}.",
            {"new": self.get_serializer(instance).data},
        )

    @transaction.atomic
    def perform_update(self, serializer):
        before = self.get_serializer(self.get_object()).data
        instance = serializer.save()
        after = self.get_serializer(instance).data

        self.audit(
            AuditLog.Action.UPDATE,
            instance,
            f"Updated delivery {instance.delivery_number}.",
            {"before": before, "after": after},
        )

    @transaction.atomic
    def perform_destroy(self, instance):
        before = self.get_serializer(instance).data

        self.audit(
            AuditLog.Action.DELETE,
            instance,
            f"Deleted delivery {instance.delivery_number}.",
            {"before": before},
        )

        instance.delete()

    @action(
        detail=True,
        methods=["post"],
        url_path="update-status",
        serializer_class=DeliveryStatusUpdateSerializer,
    )
    @transaction.atomic
    def update_status(self, request, pk=None):
        delivery = self.get_object()

        serializer = DeliveryStatusUpdateSerializer(
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data["status"]
        note = serializer.validated_data.get("note", "")

        previous_status = delivery.status

        if previous_status == new_status:
            raise ValidationError({
                "status": "The delivery already has this status."
            })

        allowed_transitions = {
            Delivery.Status.PENDING: {
                Delivery.Status.PREPARING,
                Delivery.Status.CANCELLED,
            },
            Delivery.Status.PREPARING: {
                Delivery.Status.READY,
                Delivery.Status.CANCELLED,
            },
            Delivery.Status.READY: {
                Delivery.Status.ASSIGNED,
                Delivery.Status.CANCELLED,
            },
            Delivery.Status.ASSIGNED: {
                Delivery.Status.IN_TRANSIT,
                Delivery.Status.CANCELLED,
            },
            Delivery.Status.IN_TRANSIT: {
                Delivery.Status.DELIVERED,
                Delivery.Status.FAILED,
            },
            Delivery.Status.FAILED: {
                Delivery.Status.ASSIGNED,
                Delivery.Status.RETURNED,
                Delivery.Status.CANCELLED,
            },
            Delivery.Status.DELIVERED: set(),
            Delivery.Status.CANCELLED: set(),
            Delivery.Status.RETURNED: set(),
        }

        if new_status not in allowed_transitions.get(previous_status, set()):
            raise ValidationError({
                "status": (
                    f"Cannot change delivery from {previous_status} "
                    f"to {new_status}."
                )
            })

        if new_status == Delivery.Status.IN_TRANSIT:
            delivery.dispatched_at = timezone.now()

        if new_status == Delivery.Status.DELIVERED:
            delivery.delivered_at = timezone.now()
            delivery.recipient_name = (
                serializer.validated_data.get("recipient_name", "")
            )
            delivery.recipient_phone = (
                serializer.validated_data.get("recipient_phone", "")
            )

        if new_status == Delivery.Status.FAILED:
            failure_reason = serializer.validated_data.get(
                "failure_reason",
                "",
            )

            if not failure_reason.strip():
                raise ValidationError({
                    "failure_reason": (
                        "Provide a reason when a delivery fails."
                    )
                })

            delivery.failure_reason = failure_reason

        delivery.status = new_status

        delivery.save()

        DeliveryStatusHistory.objects.create(
            delivery=delivery,
            previous_status=previous_status,
            new_status=new_status,
            note=note,
            updated_by=request.user,
        )

        self.audit(
            AuditLog.Action.UPDATE,
            delivery,
            f"Changed delivery status to {new_status}.",
            {
                "status": {
                    "old": previous_status,
                    "new": new_status,
                },
                "note": note,
            },
        )

        return Response(
            DeliverySerializer(
                delivery,
                context=self.get_serializer_context(),
            ).data,
            status=status.HTTP_200_OK,
        )


class DeliveryStatusHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DeliveryStatusHistory.objects.select_related(
        "delivery",
        "updated_by",
    ).all()

    serializer_class = DeliveryStatusHistorySerializer
    permission_classes = [IsDeliveryStaffOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]

    filterset_fields = [
        "delivery",
        "previous_status",
        "new_status",
        "updated_by",
    ]

    ordering_fields = ["created_at"]
    ordering = ["-created_at"]