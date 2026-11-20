
import django_filters

from .models import (
    DashboardSnapshot,
    ReportExecution,
)


class DashboardSnapshotFilter(django_filters.FilterSet):

    period_start_from = django_filters.DateFilter(
        field_name="period_start",
        lookup_expr="gte",
    )

    period_start_to = django_filters.DateFilter(
        field_name="period_start",
        lookup_expr="lte",
    )

    period_end_from = django_filters.DateFilter(
        field_name="period_end",
        lookup_expr="gte",
    )

    period_end_to = django_filters.DateFilter(
        field_name="period_end",
        lookup_expr="lte",
    )

    class Meta:

        model = DashboardSnapshot

        fields = [
            "snapshot_type",
            "currency",
            "period_start_from",
            "period_start_to",
            "period_end_from",
            "period_end_to",
        ]


class ReportExecutionFilter(django_filters.FilterSet):

    created_from = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__gte",
    )

    created_to = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__lte",
    )

    class Meta:

        model = ReportExecution

        fields = [
            "report_type",
            "status",
            "requested_by",
            "created_from",
            "created_to",
        ]
