
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    DashboardSnapshot,
    ReportExecution,
)

from .serializers import (
    DashboardSnapshotSerializer,
    ReportExecutionSerializer,
)

from .permissions import IsAnalyticsViewer

from .filters import (
    DashboardSnapshotFilter,
    ReportExecutionFilter,
)


class DashboardSnapshotViewSet(
    viewsets.ReadOnlyModelViewSet
):

    serializer_class = DashboardSnapshotSerializer

    permission_classes = [
        IsAnalyticsViewer,
    ]

    filterset_class = DashboardSnapshotFilter

    search_fields = [
        "title",
        "notes",
    ]

    ordering_fields = [
        "period_start",
        "period_end",
        "generated_at",
        "created_at",
    ]

    ordering = [
        "-period_end",
        "-generated_at",
    ]

    def get_queryset(self):

        return (
            DashboardSnapshot.objects
            .select_related("generated_by")
            .all()
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="latest",
    )
    def latest(self, request):

        queryset = self.filter_queryset(
            self.get_queryset()
        )

        snapshot_type = request.query_params.get(
            "snapshot_type"
        )

        if snapshot_type:
            queryset = queryset.filter(
                snapshot_type=snapshot_type
            )

        snapshot = queryset.first()

        if snapshot is None:
            return Response(
                {
                    "detail": (
                        "No dashboard snapshot is available "
                        "for the requested filters."
                    )
                },
                status=404,
            )

        serializer = self.get_serializer(snapshot)

        return Response(serializer.data)


class ReportExecutionViewSet(
    viewsets.ReadOnlyModelViewSet
):

    serializer_class = ReportExecutionSerializer

    permission_classes = [
        IsAnalyticsViewer,
    ]

    filterset_class = ReportExecutionFilter

    search_fields = [
        "report_number",
        "title",
        "description",
    ]

    ordering_fields = [
        "created_at",
        "started_at",
        "completed_at",
        "report_type",
        "status",
    ]

    ordering = [
        "-created_at",
    ]

    def get_queryset(self):

        return (
            ReportExecution.objects
            .select_related("requested_by")
            .all()
        )
