from django.test import TestCase
from rest_framework import serializers

from apps.customers.models import (
    Customer,
    CustomerAddress,
    CustomerContact,
)
from apps.customers.serializers import (
    CustomerAddressSerializer,
    CustomerContactSerializer,
    CustomerSerializer,
)


class CustomerAddressSerializerTests(TestCase):

    def test_serializer_contains_expected_fields(self):
        serializer = CustomerAddressSerializer()

        expected_fields = {
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
        }

        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_read_only_fields(self):
        serializer = CustomerAddressSerializer()

        for field in ["id", "created_at", "updated_at"]:
            self.assertTrue(serializer.fields[field].read_only)

    def test_customer_field_is_writable(self):
        serializer = CustomerAddressSerializer()

        self.assertFalse(serializer.fields["customer"].read_only)


class CustomerContactSerializerTests(TestCase):

    def test_serializer_contains_expected_fields(self):
        serializer = CustomerContactSerializer()

        expected_fields = {
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
        }

        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_read_only_fields(self):
        serializer = CustomerContactSerializer()

        for field in ["id", "created_at", "updated_at"]:
            self.assertTrue(serializer.fields[field].read_only)

    def test_customer_field_is_writable(self):
        serializer = CustomerContactSerializer()

        self.assertFalse(serializer.fields["customer"].read_only)


class CustomerSerializerTests(TestCase):

    def test_serializer_contains_expected_fields(self):
        serializer = CustomerSerializer()

        expected_fields = {
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
        }

        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_customer_number_is_read_only(self):
        serializer = CustomerSerializer()

        self.assertTrue(
            serializer.fields["customer_number"].read_only
        )

    def test_created_by_is_read_only(self):
        serializer = CustomerSerializer()

        self.assertTrue(
            serializer.fields["created_by"].read_only
        )

    def test_id_and_timestamps_are_read_only(self):
        serializer = CustomerSerializer()

        for field in ["id", "created_at", "updated_at"]:
            self.assertTrue(serializer.fields[field].read_only)

    def test_addresses_are_read_only(self):
        serializer = CustomerSerializer()

        self.assertTrue(
            serializer.fields["addresses"].read_only
        )

    def test_contacts_are_read_only(self):
        serializer = CustomerSerializer()

        self.assertTrue(
            serializer.fields["contacts"].read_only
        )

    def test_assigned_to_email_is_read_only(self):
        serializer = CustomerSerializer()

        self.assertTrue(
            serializer.fields["assigned_to_email"].read_only
        )

    def test_created_by_email_is_read_only(self):
        serializer = CustomerSerializer()

        self.assertTrue(
            serializer.fields["created_by_email"].read_only
        )

    def test_valid_individual_customer(self):
        data = {
            "customer_type": Customer.CustomerType.INDIVIDUAL,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "phone_number": "+250788123456",
        }

        serializer = CustomerSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_valid_business_customer(self):
        data = {
            "customer_type": Customer.CustomerType.BUSINESS,
            "business_name": "ABC Construction Ltd",
            "email": "info@abcconstruction.com",
            "phone_number": "+250788123456",
        }

        serializer = CustomerSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_individual_customer_requires_first_name(self):
        data = {
            "customer_type": Customer.CustomerType.INDIVIDUAL,
            "first_name": "",
            "last_name": "Doe",
            "phone_number": "+250788123456",
        }

        serializer = CustomerSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("first_name", serializer.errors)

    def test_business_customer_requires_business_name(self):
        data = {
            "customer_type": Customer.CustomerType.BUSINESS,
            "business_name": "",
            "phone_number": "+250788123456",
        }

        serializer = CustomerSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("business_name", serializer.errors)

    def test_individual_customer_rejects_whitespace_first_name(self):
        data = {
            "customer_type": Customer.CustomerType.INDIVIDUAL,
            "first_name": "   ",
            "phone_number": "+250788123456",
        }

        serializer = CustomerSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("first_name", serializer.errors)

    def test_business_customer_rejects_whitespace_business_name(self):
        data = {
            "customer_type": Customer.CustomerType.BUSINESS,
            "business_name": "   ",
            "phone_number": "+250788123456",
        }

        serializer = CustomerSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("business_name", serializer.errors)

    def test_partial_update_uses_existing_customer_type(self):
        customer = Customer(
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="John",
            last_name="Doe",
        )

        serializer = CustomerSerializer(
            instance=customer,
            data={"last_name": "Smith"},
            partial=True,
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_partial_update_rejects_missing_individual_first_name(self):
        customer = Customer(
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="John",
            last_name="Doe",
        )

        serializer = CustomerSerializer(
            instance=customer,
            data={"first_name": ""},
            partial=True,
        )

        self.assertFalse(serializer.is_valid())

        self.assertIn("first_name", serializer.errors)

    def test_partial_update_uses_existing_business_type(self):
        customer = Customer(
            customer_type=Customer.CustomerType.BUSINESS,
            business_name="ABC Construction Ltd",
        )

        serializer = CustomerSerializer(
            instance=customer,
            data={"email": "new@example.com"},
            partial=True,
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_partial_update_rejects_missing_business_name(self):
        customer = Customer(
            customer_type=Customer.CustomerType.BUSINESS,
            business_name="ABC Construction Ltd",
        )

        serializer = CustomerSerializer(
            instance=customer,
            data={"business_name": ""},
            partial=True,
        )

        self.assertFalse(serializer.is_valid())

        self.assertIn("business_name", serializer.errors)