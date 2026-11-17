from rest_framework.routers import DefaultRouter

from apps.inventory.views import (
    WarehouseViewSet,
    StockLevelViewSet,
    StockMovementViewSet,
    StockOperationViewSet,
)


router = DefaultRouter()

router.register(
    "warehouses",
    WarehouseViewSet,
    basename="warehouses",
)

router.register(
    "stock-levels",
    StockLevelViewSet,
    basename="stock-levels",
)

router.register(
    "stock-movements",
    StockMovementViewSet,
    basename="stock-movements",
)

router.register(
    "stock-operations",
    StockOperationViewSet,
    basename="stock-operations",
)

urlpatterns = router.urls