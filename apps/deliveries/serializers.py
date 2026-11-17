from rest_framework import serializers

from apps.deliveries.models import (
    Delivery,
    DeliveryStatusHistory,
)


class DeliveryStatusHistorySerializer(serializers.ModelSerializer):
    updated_by_email = serializers.CharField(
        source="updated_by.email",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = DeliveryStatusHistory
        fields = [
            "id",
            "delivery",
            "previous_status",
            "new_status",
            "note",
            "updated_by",
            "updated_by_email",
            "created_at",
        ]

        read_only_fields = fields


class DeliverySerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.__str__",
        read_only=True,
    )

    delivery_address_display = serializers.SerializerMethodField()

    driver_email = serializers.CharField(
        source="assigned_driver.email",
        read_only=True,
        allow_null=True,
    )

    status_history = DeliveryStatusHistorySerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Delivery
        fields = [
            "id",
            "delivery_number",
            "tracking_number",
            "order_reference",
            "customer",
            "customer_name",
            "delivery_address",
            "delivery_address_display",
            "status",
            "vehicle_type",
            "vehicle_registration",
            "driver_name",
            "driver_phone",
            "assigned_driver",
            "driver_email",
            "delivery_fee",
            "estimated_delivery_at",
            "dispatched_at",
            "delivered_at",
            "recipient_name",
            "recipient_phone",
            "delivery_notes",
            "failure_reason",
            "proof_of_delivery",
            "created_by",
            "status_history",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "delivery_number",
            "tracking_number",
            "dispatched_at",
            "delivered_at",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def get_delivery_address_display(self, obj):
        address = obj.delivery_address

        return ", ".join(
            part
            for part in [
                address.street_address,
                address.village,
                address.cell,
                address.sector,
                address.district,
                address.province,
                address.country,
            ]
            if part
        )

    def validate(self, attrs):
        customer = attrs.get(
            "customer",
            getattr(self.instance, "customer", None),
        )

        address = attrs.get(
            "delivery_address",
            getattr(self.instance, "delivery_address", None),
        )

        if customer and address and address.customer_id != customer.id:
            raise serializers.ValidationError({
                "delivery_address": (
                    "The selected address does not belong to this customer."
                )
            })

        if customer and not customer.is_active:
            raise serializers.ValidationError({
                "customer": "Cannot create a delivery for an inactive customer."
            })

        return attrs


class DeliveryStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=Delivery.Status.choices,
    )

    note = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    recipient_name = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    recipient_phone = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    failure_reason = serializers.CharField(
        required=False,
        allow_blank=True,
    )