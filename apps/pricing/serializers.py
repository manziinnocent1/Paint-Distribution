
from rest_framework import serializers

from .models import Price, Discount


class PriceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Price
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        price_type = attrs.get(
            "price_type",
            getattr(self.instance, "price_type", None),
        )
        customer = attrs.get(
            "customer",
            getattr(self.instance, "customer", None),
        )

        if price_type == Price.PriceType.CUSTOMER and not customer:
            raise serializers.ValidationError({
                "customer": "A customer is required for customer-specific pricing."
            })

        if price_type != Price.PriceType.CUSTOMER and customer:
            raise serializers.ValidationError({
                "customer": "Customer-specific prices must use CUSTOMER price type."
            })

        start = attrs.get(
            "effective_from",
            getattr(self.instance, "effective_from", None),
        )
        end = attrs.get(
            "effective_until",
            getattr(self.instance, "effective_until", None),
        )

        if end and start and end <= start:
            raise serializers.ValidationError({
                "effective_until": "The end date must be after the start date."
            })

        return attrs


class DiscountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Discount
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        discount_type = attrs.get(
            "discount_type",
            getattr(self.instance, "discount_type", None),
        )
        value = attrs.get(
            "value",
            getattr(self.instance, "value", None),
        )

        if (
            discount_type == Discount.DiscountType.PERCENTAGE
            and value is not None
            and value > 100
        ):
            raise serializers.ValidationError({
                "value": "Percentage discounts cannot exceed 100."
            })

        return attrs
