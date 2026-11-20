from rest_framework.routers import DefaultRouter

from .views import (
    SupplierViewSet,
    SupplierContactViewSet,
    SupplierProductViewSet,
)


router = DefaultRouter()

router.register(
    "suppliers",
    SupplierViewSet,
    basename="supplier",
)

router.register(
    "supplier-contacts",
    SupplierContactViewSet,
    basename="supplier-contact",
)

router.register(
    "supplier-products",
    SupplierProductViewSet,
    basename="supplier-product",
)


urlpatterns = router.urls