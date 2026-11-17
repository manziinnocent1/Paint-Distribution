from rest_framework.routers import DefaultRouter

from apps.customers.views import (
    CustomerViewSet,
    CustomerAddressViewSet,
    CustomerContactViewSet,
)


router = DefaultRouter()

router.register(
    "customers",
    CustomerViewSet,
    basename="customers",
)

router.register(
    "addresses",
    CustomerAddressViewSet,
    basename="customer-addresses",
)

router.register(
    "contacts",
    CustomerContactViewSet,
    basename="customer-contacts",
)

urlpatterns = router.urls