
import uuid

from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from .models import (
    Supplier,
    SupplierContact,
    SupplierProduct,
)

from .serializers import (
    SupplierSerializer,
    SupplierContactSerializer,
    SupplierProductSerializer,
)

from .permissions import SupplierPermission

from .filters import (
    SupplierFilter,
    SupplierContactFilter,
    SupplierProductFilter,
)


def generate_supplier_number():
    return f"SUP-{uuid.uuid4().hex[:10].upper()}"


class SupplierViewSet(viewsets.ModelViewSet):

    serializer_class = SupplierSerializer
    permission_classes = [SupplierPermission]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = SupplierFilter

    search_fields = [
        "supplier_number",
        "name",
        "contact_person",
        "email",
        "phone_number",
        "tax_identification_number",
    ]

    ordering_fields = [
        "name",
        "created_at",
        "payment_terms_days",
        "status",
    ]

    ordering = ["name"]

    def get_queryset(self):
        return Supplier.objects.select_related(
            "created_by",
        ).prefetch_related(
            "contacts",
            "products",
        ).order_by("name", "pk")

    @transaction.atomic
    def perform_create(self, serializer):
        serializer.save(
            supplier_number=generate_supplier_number(),
            created_by=self.request.user,
        )

    @action(
        detail=True,
        methods=["get"],
        url_path="contacts",
    )
    def contacts(self, request, pk=None):
        supplier = self.get_object()

        contacts = supplier.contacts.all().order_by(
            "full_name",
            "pk",
        )

        serializer = SupplierContactSerializer(
            contacts,
            many=True,
        )

        return Response(serializer.data)

    @action(
        detail=True,
        methods=["get"],
        url_path="products",
    )
    def products(self, request, pk=None):
        supplier = self.get_object()

        products = supplier.products.select_related(
            "product_variant",
            "product_variant__product",
        ).order_by("pk")

        serializer = SupplierProductSerializer(
            products,
            many=True,
        )

        return Response(serializer.data)

    @action(
        detail=True,
        methods=["patch"],
        url_path="activate",
    )
    def activate(self, request, pk=None):
        supplier = self.get_object()

        supplier.status = Supplier.Status.ACTIVE

        supplier.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            SupplierSerializer(supplier).data
        )

    @action(
        detail=True,
        methods=["patch"],
        url_path="deactivate",
    )
    def deactivate(self, request, pk=None):
        supplier = self.get_object()

        supplier.status = Supplier.Status.INACTIVE

        supplier.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            SupplierSerializer(supplier).data
        )


class SupplierContactViewSet(viewsets.ModelViewSet):

    serializer_class = SupplierContactSerializer
    permission_classes = [SupplierPermission]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = SupplierContactFilter

    search_fields = [
        "full_name",
        "email",
        "phone_number",
        "job_title",
    ]

    ordering_fields = [
        "full_name",
        "created_at",
    ]

    ordering = ["full_name", "pk"]

    def get_queryset(self):
        queryset = SupplierContact.objects.select_related(
            "supplier",
        )

        supplier_id = self.request.query_params.get("supplier")

        if supplier_id:
            queryset = queryset.filter(
                supplier_id=supplier_id,
            )

        return queryset.order_by("full_name", "pk")


class SupplierProductViewSet(viewsets.ModelViewSet):

    serializer_class = SupplierProductSerializer
    permission_classes = [SupplierPermission]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = SupplierProductFilter

    search_fields = [
        "supplier__name",
        "product_variant__name",
        "product_variant__sku",
    ]

    ordering_fields = [
        "last_purchase_price",
        "lead_time_days",
        "created_at",
    ]

    ordering = ["created_at", "pk"]

    def get_queryset(self):
        queryset = SupplierProduct.objects.select_related(
            "supplier",
            "product_variant",
            "product_variant__product",
        )

        supplier_id = self.request.query_params.get("supplier")

        if supplier_id:
            queryset = queryset.filter(
                supplier_id=supplier_id,
            )

        return queryset.order_by("created_at", "pk")
