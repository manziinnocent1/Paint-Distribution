from rest_framework import viewsets, filters

from django_filters.rest_framework import DjangoFilterBackend

from apps.audit.models import AuditLog
from apps.audit.serializers import AuditLogSerializer
from apps.audit.permissions import IsAuditManager
from apps.audit.filters import AuditLogFilter


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuditManager]

    queryset = AuditLog.objects.select_related(
        "actor",
        "content_type",
    ).all()

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = AuditLogFilter

    search_fields = [
        "description",
        "object_repr",
        "actor__email",
    ]

    ordering_fields = [
        "created_at",
        "action",
    ]

    ordering = ["-created_at"]