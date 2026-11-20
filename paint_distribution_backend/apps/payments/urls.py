
from rest_framework.routers import DefaultRouter

from .views import PaymentViewSet, PaymentRefundViewSet

router = DefaultRouter()
router.register("payments", PaymentViewSet, basename="payments")
router.register("refunds", PaymentRefundViewSet, basename="payment-refunds")

urlpatterns = router.urls
