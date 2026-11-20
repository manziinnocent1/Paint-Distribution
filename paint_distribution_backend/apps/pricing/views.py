
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Price, Discount
from .permissions import IsPricingStaff
from .serializers import PriceSerializer, DiscountSerializer


class PriceViewSet(viewsets.ModelViewSet):
    serializer_class = PriceSerializer
    permission_classes = [IsAuthenticated, IsPricingStaff]

    queryset = Price.objects.select_related("customer", "created_by")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class DiscountViewSet(viewsets.ModelViewSet):
    serializer_class = DiscountSerializer
    permission_classes = [IsAuthenticated, IsPricingStaff]

    queryset = Discount.objects.select_related("customer", "created_by")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
