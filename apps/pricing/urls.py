
from rest_framework.routers import DefaultRouter

from .views import PriceViewSet, DiscountViewSet

router = DefaultRouter()
router.register("prices", PriceViewSet, basename="prices")
router.register("discounts", DiscountViewSet, basename="discounts")

urlpatterns = router.urls
