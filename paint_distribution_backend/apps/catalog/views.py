from django.db import transaction
from rest_framework import viewsets, filters

from django_filters.rest_framework import DjangoFilterBackend

from apps.audit.models import AuditLog
from apps.audit.services import record_audit_event

from apps.catalog.models import (
    Category,
    Brand,
    Product,
    ProductVariant,
    ProductImage,
    ProductAttribute,
    ProductAttributeValue,
)

from apps.catalog.serializers import (
    CategorySerializer,
    BrandSerializer,
    ProductSerializer,
    ProductVariantSerializer,
    ProductImageSerializer,
    ProductAttributeSerializer,
    ProductAttributeValueSerializer,
)

from apps.catalog.permissions import IsCatalogManagerOrReadOnly
from apps.catalog.filters import (
    CategoryFilter,
    BrandFilter,
    ProductFilter,
    ProductVariantFilter,
)


class AuditedModelViewSet(viewsets.ModelViewSet):
    """
    Base viewset that records create, update and delete events.
    """

    permission_classes = [IsCatalogManagerOrReadOnly]

    def get_request_metadata(self):
        request = self.request

        return {
            "ip_address": request.META.get("REMOTE_ADDR"),
            "user_agent": request.META.get("HTTP_USER_AGENT", ""),
        }

    def record_event(self, action, instance, description, changes=None):
        metadata = self.get_request_metadata()

        record_audit_event(
            actor=self.request.user,
            action=action,
            description=description,
            instance=instance,
            changes=changes or {},
            metadata={"application": "catalog"},
            ip_address=metadata["ip_address"],
            user_agent=metadata["user_agent"],
        )

    @transaction.atomic
    def perform_create(self, serializer):
        instance = serializer.save()

        self.record_event(
            AuditLog.Action.CREATE,
            instance,
            f"Created {instance._meta.verbose_name}: {instance}",
            changes={
                "new": serializer.data,
            },
        )

    @transaction.atomic
    def perform_update(self, serializer):
        before = self.get_serializer(self.get_object()).data

        instance = serializer.save()

        after = self.get_serializer(instance).data

        self.record_event(
            AuditLog.Action.UPDATE,
            instance,
            f"Updated {instance._meta.verbose_name}: {instance}",
            changes={
                "before": before,
                "after": after,
            },
        )

    @transaction.atomic
    def perform_destroy(self, instance):
        before = self.get_serializer(instance).data

        self.record_event(
            AuditLog.Action.DELETE,
            instance,
            f"Deleted {instance._meta.verbose_name}: {instance}",
            changes={
                "before": before,
            },
        )

        instance.delete()


class CategoryViewSet(AuditedModelViewSet):
    queryset = Category.objects.select_related("parent").all()
    serializer_class = CategorySerializer
    filterset_class = CategoryFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = ["name", "description", "slug"]
    ordering_fields = ["name", "created_at", "display_order"]
    ordering = ["display_order", "name"]


class BrandViewSet(AuditedModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    filterset_class = BrandFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]


class ProductViewSet(AuditedModelViewSet):
    queryset = Product.objects.select_related(
        "category",
        "brand",
        "created_by",
    ).prefetch_related(
        "variants",
        "images",
        "attribute_values__attribute",
    )

    serializer_class = ProductSerializer
    filterset_class = ProductFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "name",
        "product_code",
        "description",
        "brand__name",
        "category__name",
    ]

    ordering_fields = [
        "name",
        "created_at",
        "updated_at",
        "tax_rate",
    ]

    ordering = ["name"]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        instance = serializer.instance

        self.record_event(
            AuditLog.Action.CREATE,
            instance,
            f"Created product: {instance}",
            changes={"new": self.get_serializer(instance).data},
        )


class ProductVariantViewSet(AuditedModelViewSet):
    queryset = ProductVariant.objects.select_related("product").all()
    serializer_class = ProductVariantSerializer
    filterset_class = ProductVariantFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "name",
        "sku",
        "barcode",
        "colour_name",
        "colour_code",
        "ral_code",
        "product__name",
    ]

    ordering_fields = [
        "selling_price",
        "cost_price",
        "created_at",
    ]

    ordering = ["product__name", "name"]


class ProductImageViewSet(AuditedModelViewSet):
    queryset = ProductImage.objects.select_related(
        "product",
        "variant",
    ).all()

    serializer_class = ProductImageSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]

    filterset_fields = ["product", "variant", "is_primary"]
    ordering_fields = ["display_order", "created_at"]
    ordering = ["display_order"]


class ProductAttributeViewSet(AuditedModelViewSet):
    queryset = ProductAttribute.objects.all()
    serializer_class = ProductAttributeSerializer

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]


class ProductAttributeValueViewSet(AuditedModelViewSet):
    queryset = ProductAttributeValue.objects.select_related(
        "product",
        "attribute",
    ).all()

    serializer_class = ProductAttributeValueSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = ["product", "attribute"]
    search_fields = [
        "value",
        "product__name",
        "attribute__name",
    ]