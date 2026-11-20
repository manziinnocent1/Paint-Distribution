import django_filters

from apps.audit.models import AuditLog


class AuditLogFilter(django_filters.FilterSet):
    created_from = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__gte",
    )

    created_to = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__lte",
    )

    class Meta:
        model = AuditLog
        fields = [
            "action",
            "actor",
            "content_type",
            "created_from",
            "created_to",
        ]