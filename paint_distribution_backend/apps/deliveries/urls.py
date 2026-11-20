from rest_framework.routers import DefaultRouter

from apps.deliveries.views import (
    DeliveryViewSet,
    DeliveryStatusHistoryViewSet,
)


router = DefaultRouter()

router.register(
    "deliveries",
    DeliveryViewSet,
    basename="deliveries",
)

router.register(
    "status-history",
    DeliveryStatusHistoryViewSet,
    basename="delivery-status-history",
)

urlpatterns = router.urls