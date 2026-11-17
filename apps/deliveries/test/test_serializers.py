
from django.test import TestCase
from rest_framework import serializers

from apps.customers.models import Customer, CustomerAddress
from apps.deliveries.models import Delivery, DeliveryStatusHistory
from apps.deliveries.serializers import (
    DeliverySerializer,
    DeliveryStatusHistorySerializer,
    DeliveryStatusUpdateSerializer,
)


class DeliverySerializerTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.customer = Customer.objects.create(
            customer_number="CUS-DELTEST01",
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="John",
            last_name="Doe",
            email="john.delivery@example.com",
            phone_number="+250788123456",
        )

        cls.address = CustomerAddress.objects.create(
            customer=cls.customer,
            address_type="DELIVERY",
            country="Rwanda",
            province="Kigali",
            district="Gasabo",
            sector="Remera",
            street_address="KG 11 Avenue",
            is_default=True,
            is_active=True,
        )

        cls.delivery = Delivery.objects.create(
            delivery_number="DEL-TEST000001",
            tracking_number="TRK-TEST000001",
            customer=cls.customer,
            delivery_address=cls.address,
            vehicle_type=Delivery.VehicleType.MOTORCYCLE,
            driver_name="James Driver",
            driver_phone="+250788111111",
            delivery_fee="5000.00",
        )

    def test_serializer_contains_expected_fields(self):
        serializer = DeliverySerializer()

        expected_fields = {
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
        }

        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_read_only_fields(self):
        serializer = DeliverySerializer()

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

        for field in read_only_fields:
            with self.subTest(field=field):
                self.assertTrue(
                    serializer.fields[field].read_only
                )

    def test_customer_name_is_read_only(self):
        serializer = DeliverySerializer()

        self.assertTrue(
            serializer.fields["customer_name"].read_only
        )

    def test_delivery_address_display_is_read_only(self):
        serializer = DeliverySerializer()

        self.assertTrue(
            serializer.fields["delivery_address_display"].read_only
        )

    def test_driver_email_is_read_only(self):
        serializer = DeliverySerializer()

        self.assertTrue(
            serializer.fields["driver_email"].read_only
        )

    def test_status_history_is_read_only(self):
        serializer = DeliverySerializer()

        self.assertTrue(
            serializer.fields["status_history"].read_only
        )

    def test_customer_name_serialization(self):
        serializer = DeliverySerializer(self.delivery)

        self.assertEqual(
            serializer.data["customer_name"],
            str(self.customer),
        )

    def test_delivery_address_display(self):
        serializer = DeliverySerializer(self.delivery)

        self.assertEqual(
            serializer.data["delivery_address_display"],
            "KG 11 Avenue, Remera, Gasabo, Kigali, Rwanda",
        )

    def test_delivery_address_display_ignores_empty_fields(self):
        self.address.street_address = ""
        self.address.village = ""
        self.address.cell = ""
        self.address.save()

        serializer = DeliverySerializer(self.delivery)

        self.assertEqual(
            serializer.data["delivery_address_display"],
            "Remera, Gasabo, Kigali, Rwanda",
        )

    def test_valid_delivery_data(self):
        data = {
            "customer": str(self.customer.pk),
            "delivery_address": str(self.address.pk),
            "vehicle_type": Delivery.VehicleType.CAR,
            "vehicle_registration": "RAA 123 A",
            "driver_name": "Peter Driver",
            "driver_phone": "+250788222222",
            "delivery_fee": "7500.00",
            "delivery_notes": "Handle with care.",
        }

        serializer = DeliverySerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_delivery_rejects_address_from_another_customer(self):
        another_customer = Customer.objects.create(
            customer_number="CUS-DELTEST02",
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="Jane",
            last_name="Smith",
            email="jane.delivery@example.com",
            phone_number="+250788123457",
        )

        another_address = CustomerAddress.objects.create(
            customer=another_customer,
            address_type="DELIVERY",
            country="Rwanda",
            district="Kicukiro",
            sector="Kicukiro",
        )

        data = {
            "customer": str(self.customer.pk),
            "delivery_address": str(another_address.pk),
        }

        serializer = DeliverySerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn(
            "delivery_address",
            serializer.errors,
        )

    def test_delivery_rejects_inactive_customer(self):
        self.customer.status = "inactive"
        self.customer.save()

        data = {
            "customer": str(self.customer.pk),
            "delivery_address": str(self.address.pk),
        }

        serializer = DeliverySerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("customer", serializer.errors)

    def test_delivery_fee_cannot_be_negative(self):
        data = {
            "customer": str(self.customer.pk),
            "delivery_address": str(self.address.pk),
            "delivery_fee": "-100.00",
        }

        serializer = DeliverySerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("delivery_fee", serializer.errors)

    def test_valid_partial_update(self):
        serializer = DeliverySerializer(
            instance=self.delivery,
            data={"driver_name": "Updated Driver"},
            partial=True,
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_partial_update_rejects_address_from_another_customer(self):
        another_customer = Customer.objects.create(
            customer_number="CUS-DELTEST03",
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="Michael",
            last_name="Smith",
            email="michael.delivery@example.com",
        )

        another_address = CustomerAddress.objects.create(
            customer=another_customer,
            address_type="DELIVERY",
            country="Rwanda",
            district="Nyarugenge",
            sector="Nyarugenge",
        )

        serializer = DeliverySerializer(
            instance=self.delivery,
            data={
                "delivery_address": str(another_address.pk),
            },
            partial=True,
        )

        self.assertFalse(serializer.is_valid())

        self.assertIn(
            "delivery_address",
            serializer.errors,
        )


class DeliveryStatusHistorySerializerTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.customer = Customer.objects.create(
            customer_number="CUS-HISTORY01",
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="Alice",
            last_name="Smith",
            email="alice.history@example.com",
        )

        cls.address = CustomerAddress.objects.create(
            customer=cls.customer,
            address_type="DELIVERY",
            country="Rwanda",
            district="Gasabo",
            sector="Remera",
        )

        cls.delivery = Delivery.objects.create(
            delivery_number="DEL-HISTORY01",
            tracking_number="TRK-HISTORY01",
            customer=cls.customer,
            delivery_address=cls.address,
        )

        cls.history = DeliveryStatusHistory.objects.create(
            delivery=cls.delivery,
            previous_status=Delivery.Status.PENDING,
            new_status=Delivery.Status.PREPARING,
            note="Preparation started.",
        )

    def test_serializer_contains_expected_fields(self):
        serializer = DeliveryStatusHistorySerializer()

        expected_fields = {
            "id",
            "delivery",
            "previous_status",
            "new_status",
            "note",
            "updated_by",
            "updated_by_email",
            "created_at",
        }

        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_all_history_fields_are_read_only(self):
        serializer = DeliveryStatusHistorySerializer()

        for field in serializer.fields.values():
            self.assertTrue(field.read_only)

    def test_history_serialization(self):
        serializer = DeliveryStatusHistorySerializer(self.history)

        self.assertEqual(
            str(serializer.data["delivery"]),
            str(self.delivery.pk),
        )

        self.assertEqual(
            serializer.data["previous_status"],
            Delivery.Status.PENDING,
        )

        self.assertEqual(
            serializer.data["new_status"],
            Delivery.Status.PREPARING,
        )

        self.assertEqual(
            serializer.data["note"],
            "Preparation started.",
        )


class DeliveryStatusUpdateSerializerTests(TestCase):

    def test_serializer_contains_expected_fields(self):
        serializer = DeliveryStatusUpdateSerializer()

        expected_fields = {
            "status",
            "note",
            "recipient_name",
            "recipient_phone",
            "failure_reason",
        }

        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_valid_status_update(self):
        data = {
            "status": Delivery.Status.PREPARING,
            "note": "The order is being prepared.",
        }

        serializer = DeliveryStatusUpdateSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_invalid_status_is_rejected(self):
        data = {
            "status": "UNKNOWN_STATUS",
        }

        serializer = DeliveryStatusUpdateSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("status", serializer.errors)

    def test_status_is_required(self):
        serializer = DeliveryStatusUpdateSerializer(data={})

        self.assertFalse(serializer.is_valid())

        self.assertIn("status", serializer.errors)

    def test_optional_fields_can_be_omitted(self):
        serializer = DeliveryStatusUpdateSerializer(
            data={
                "status": Delivery.Status.READY,
            }
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_optional_fields_accept_blank_values(self):
        data = {
            "status": Delivery.Status.PREPARING,
            "note": "",
            "recipient_name": "",
            "recipient_phone": "",
            "failure_reason": "",
        }

        serializer = DeliveryStatusUpdateSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_delivery_completion_data_is_valid(self):
        data = {
            "status": Delivery.Status.DELIVERED,
            "recipient_name": "John Doe",
            "recipient_phone": "+250788123456",
            "note": "Delivered successfully.",
        }

        serializer = DeliveryStatusUpdateSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

        self.assertEqual(
            serializer.validated_data["recipient_name"],
            "John Doe",
        )

    def test_failure_reason_can_be_submitted(self):
        data = {
            "status": Delivery.Status.FAILED,
            "failure_reason": "Customer was unavailable.",
        }

        serializer = DeliveryStatusUpdateSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )
