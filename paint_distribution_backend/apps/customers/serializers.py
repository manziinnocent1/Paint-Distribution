from rest_framework import serializers

from apps.customers.models import (
    Customer,
    CustomerAddress,
    CustomerContact,
)


class ActiveCustomerValidationMixin:
    """
    Rejects addresses/contacts for customers that are not active.
    Customer uses a `status` field (not `is_active`).
    The error is keyed under "customer" so clients and tests can
    find it with response.data["customer"].
    """

    def validate_customer(self, customer):
        if customer.status != Customer.Status.ACTIVE:
            raise serializers.ValidationError(
                "This customer is not active."
            )
        return customer


class CustomerAddressSerializer(
    ActiveCustomerValidationMixin,
    serializers.ModelSerializer,
):
    class Meta:
        model = CustomerAddress
        fields = [
            "id",
            "customer",
            "address_type",
            "label",
            "contact_person",
            "contact_phone",
            "country",
            "province",
            "district",
            "sector",
            "cell",
            "village",
            "street_address",
            "landmark",
            "postal_code",
            "latitude",
            "longitude",
            "is_default",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CustomerContactSerializer(
    ActiveCustomerValidationMixin,
    serializers.ModelSerializer,
):
    class Meta:
        model = CustomerContact
        fields = [
            "id",
            "customer",
            "full_name",
            "job_title",
            "email",
            "phone_number",
            "is_primary",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CustomerSerializer(serializers.ModelSerializer):
    addresses = CustomerAddressSerializer(
        many=True,
        read_only=True,
    )

    contacts = CustomerContactSerializer(
        many=True,
        read_only=True,
    )

    assigned_to_email = serializers.CharField(
        source="assigned_to.email",
        read_only=True,
        allow_null=True,
    )

    created_by_email = serializers.CharField(
        source="created_by.email",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Customer
        fields = [
            "id",
            "customer_number",
            "customer_type",
            "first_name",
            "last_name",
            "business_name",
            "tax_identification_number",
            "email",
            "phone_number",
            "alternative_phone",
            "website",
            "status",
            "notes",
            "credit_limit",
            "payment_terms_days",
            "assigned_to",
            "assigned_to_email",
            "created_by",
            "created_by_email",
            "addresses",
            "contacts",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "customer_number",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        customer_type = attrs.get(
            "customer_type",
            getattr(
                self.instance,
                "customer_type",
                Customer.CustomerType.INDIVIDUAL,
            ),
        )

        first_name = attrs.get(
            "first_name",
            getattr(self.instance, "first_name", ""),
        ) or ""

        business_name = attrs.get(
            "business_name",
            getattr(self.instance, "business_name", ""),
        ) or ""

        if (
            customer_type == Customer.CustomerType.INDIVIDUAL
            and not first_name.strip()
        ):
            raise serializers.ValidationError({
                "first_name": "First name is required for an individual customer."
            })

        if (
            customer_type == Customer.CustomerType.BUSINESS
            and not business_name.strip()
        ):
            raise serializers.ValidationError({
                "business_name": "Business name is required for a business customer."
            })

        return attrs