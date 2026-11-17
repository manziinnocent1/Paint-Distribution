from django.db import transaction
from rest_framework import viewsets, filters

from django_filters.rest_framework import DjangoFilterBackend

from apps.audit.models import AuditLog
from apps.audit.services import record_audit_event

from apps.colors.models import (
    ColorFamily,
    Color,
    ColorFormula,
    ColorFormulaIngredient,
)

from apps.colors.serializers import (
    ColorFamilySerializer,
    ColorSerializer,
    ColorFormulaSerializer,
    ColorFormulaIngredientSerializer,
)

from apps.colors.permissions import (
    IsColorManagerOrReadOnly,
    IsFormulaManager,
)

from apps.colors.filters import (
    ColorFilter,
    ColorFormulaFilter,
)


class ColorAuditMixin:
    def audit(self, action, instance, description, changes=None):
        request = self.request

        record_audit_event(
            actor=request.user,
            action=action,
            description=description,
            instance=instance,
            changes=changes or {},
            metadata={"application": "colors"},
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
        )

    @transaction.atomic
    def perform_create(self, serializer):
        instance = serializer.save(
            created_by=self.request.user
        )

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


class ColorFamilyViewSet(ColorAuditMixin, viewsets.ModelViewSet):
    queryset = ColorFamily.objects.all()
    serializer_class = ColorFamilySerializer
    permission_classes = [IsColorManagerOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ["is_active"]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]


class ColorViewSet(ColorAuditMixin, viewsets.ModelViewSet):
    queryset = Color.objects.select_related(
        "family",
        "created_by",
    ).all()

    serializer_class = ColorSerializer
    permission_classes = [IsColorManagerOrReadOnly]
    filterset_class = ColorFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "name",
        "code",
        "ral_code",
        "description",
    ]

    ordering_fields = ["name", "code", "created_at"]
    ordering = ["name"]


class ColorFormulaViewSet(ColorAuditMixin, viewsets.ModelViewSet):
    queryset = ColorFormula.objects.select_related(
        "color",
        "paint_product",
        "paint_variant",
        "created_by",
    ).prefetch_related("ingredients")

    serializer_class = ColorFormulaSerializer
    permission_classes = [IsFormulaManager]
    filterset_class = ColorFormulaFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "name",
        "color__name",
        "color__code",
    ]

    ordering_fields = ["version", "created_at"]
    ordering = ["-created_at"]


class ColorFormulaIngredientViewSet(
    ColorAuditMixin,
    viewsets.ModelViewSet,
):
    queryset = ColorFormulaIngredient.objects.select_related(
        "formula",
        "formula__color",
    )

    serializer_class = ColorFormulaIngredientSerializer
    permission_classes = [IsFormulaManager]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = ["formula", "unit"]
    search_fields = [
        "ingredient_name",
        "ingredient_code",
        "formula__color__name",
    ]