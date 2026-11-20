from rest_framework.routers import DefaultRouter

from .views import (
    SalesQuotationViewSet,
    SaleViewSet,
    SalesReturnViewSet,
)


router = DefaultRouter()

router.register(
    "quotations",
    SalesQuotationViewSet,
    basename="sales-quotation",
)

router.register(
    "sales",
    SaleViewSet,
    basename="sale",
)

router.register(
    "sales-returns",
    SalesReturnViewSet,
    basename="sales-return",
)


urlpatterns = router.urls