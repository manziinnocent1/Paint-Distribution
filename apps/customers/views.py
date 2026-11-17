import uuid

from django.db import transaction
from rest_framework import viewsets, filters
from rest_framework.exceptions import ValidationError

from django_filters.rest_framework import DjangoFilterBackend

from apps.audit.models import AuditLog
from apps.audit.services import record_audit_event

from apps.customers.models import (
    Customer,
    CustomerAddress,
    CustomerContact,
)

from apps.customers.serializers import (
    CustomerSerializer,
    CustomerAddressSerializer,
    CustomerContactSerializer,
)

from apps.customers.permissions import IsCustomerStaffOrReadOnly

from apps.customers.filters import (
    CustomerFilter,
    CustomerAddressFilter,
)


class CustomerAuditMixin:
    def audit(self, action, instance, description, changes=None):
        request = self.request

        record_audit_event(
            actor=request.user,
            action=action,
            description=description,
            instance=instance,
            changes=changes or {},
            metadata={"application": "customers"},
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
        )

    @transaction.atomic
    def perform_create(self, serializer):
        instance = serializer.save()

        self.audit(
            AuditLog.Action.CREATE,
            instance,
            f"Created {instance._meta.verbose_name}: {instance}",
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
            f"Updated {instance._meta.verbose_name}: {instance}",
            {"before": before, "after": after},
        )

    @transaction.atomic
    def perform_destroy(self, instance):
        before = self.get_serializer(instance).data

        self.audit(
            AuditLog.Action.DELETE,
            instance,
            f"Deleted {instance._meta.verbose_name}: {instance}",
            {"before": before},
        )

        instance.delete()


class CustomerViewSet(CustomerAuditMixin, viewsets.ModelViewSet):
    queryset = Customer.objects.select_related(
        "assigned_to",
        "created_by",
    ).prefetch_related(
        "addresses",
        "contacts",
    )

    serializer_class = CustomerSerializer
    permission_classes = [IsCustomerStaffOrReadOnly]
    filterset_class = CustomerFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "customer_number",
        "first_name",
        "last_name",
        "business_name",
        "email",
        "phone_number",
        "tax_identification_number",
    ]

    ordering_fields = ["created_at", "business_name", "first_name"]
    ordering = ["-created_at"]

    def perform_create(self, serializer):
        customer_number = f"CUS-{uuid.uuid4().hex[:10].upper()}"

        instance = serializer.save(
            customer_number=customer_number,
            created_by=self.request.user,
        )

        self.audit(
            AuditLog.Action.CREATE,
            instance,
            f"Created customer: {instance}",
            {"new": self.get_serializer(instance).data},
        )


class CustomerAddressViewSet(
    CustomerAuditMixin,
    viewsets.ModelViewSet,
):
    queryset = CustomerAddress.objects.select_related("customer")
    serializer_class = CustomerAddressSerializer
    permission_classes = [IsCustomerStaffOrReadOnly]
    filterset_class = CustomerAddressFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    search_fields = [
        "label",
        "contact_person",
        "contact_phone",
        "district",
        "sector",
        "street_address",
    ]

    def perform_create(self, serializer):
        customer = serializer.validated_data["customer"]

        if not customer.is_active:
            raise ValidationError(
                {"customer": "Cannot add an address to an inactive customer."}
            )

        instance = serializer.save()

        self.audit(
            AuditLog.Action.CREATE,
            instance,
            f"Created customer address for {customer}",
            {"new": self.get_serializer(instance).data},
        )


class CustomerContactViewSet(
    CustomerAuditMixin,
    viewsets.ModelViewSet,
):
    queryset = CustomerContact.objects.select_related("customer")
    serializer_class = CustomerContactSerializer
    permission_classes = [IsCustomerStaffOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = ["customer", "is_primary"]
    search_fields = [
        "full_name",
        "job_title",
        "email",
        "phone_number",
        "customer__business_name",
    ]

    def perform_create(self, serializer):
        customer = serializer.validated_data["customer"]

        if not customer.is_active:
            raise ValidationError(
                {"customer": "Cannot add a contact to an inactive customer."}
            )

        instance = serializer.save()

        self.audit(
            AuditLog.Action.CREATE,
            instance,
            f"Created customer contact: {instance}",
            {"new": self.get_serializer(instance).data},
        )