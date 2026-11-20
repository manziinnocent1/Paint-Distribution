
from rest_framework.routers import DefaultRouter

from .views import (
    DashboardSnapshotViewSet,
    ReportExecutionViewSet,
)


router = DefaultRouter()

router.register(
    "snapshots",
    DashboardSnapshotViewSet,
    basename="analytics-snapshots",
)

router.register(
    "reports",
    ReportExecutionViewSet,
    basename="analytics-reports",
)

urlpatterns = router.urls
