
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.customers.models import Customer, CustomerAddress
from apps.deliveries.models import Delivery, DeliveryStatusHistory


User = get_user_model()


class DeliveryViewSetTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.manager = User.objects.create_user(
            email="deliverymanager@example.com",
            password="TestPassword123!",
            role="manager",
        )

        cls.customer = Customer.objects.create(
            customer_number="CUS-VIEW0001",
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="John",
            last_name="Doe",
            email="john.view@example.com",
            phone_number="+250788123456",
            created_by=cls.manager,
        )

        cls.address = CustomerAddress.objects.create(
            customer=cls.customer,
            address_type="DELIVERY",
            contact_person="John Doe",
            contact_phone="+250788123456",
            country="Rwanda",
            province="Kigali",
            district="Gasabo",
            sector="Remera",
            street_address="KG 11 Avenue",
            is_default=True,
            is_active=True,
        )

    def setUp(self):
        self.client.force_authenticate(user=self.manager)

    def create_delivery(self, **kwargs):
        defaults = {
            "delivery_number": "DEL-TEST000001",
            "tracking_number": "TRK-TEST000001",
            "customer": self.customer,
            "delivery_address": self.address,
            "status": Delivery.Status.PENDING,
            "vehicle_type": Delivery.VehicleType.MOTORCYCLE,
            "driver_name": "James Driver",
            "driver_phone": "+250788111111",
            "delivery_fee": "5000.00",
            "created_by": self.manager,
        }

        defaults.update(kwargs)

        return Delivery.objects.create(**defaults)

    def delivery_url(self, delivery):
        return reverse(
            "deliveries-detail",
            kwargs={"pk": delivery.pk},
        )

    def status_url(self, delivery):
        return reverse(
            "deliveries-update-status",
            kwargs={"pk": delivery.pk},
        )

    def delivery_data(self):
        return {
            "customer": str(self.customer.pk),
            "delivery_address": str(self.address.pk),
            "order_reference": "ORDER-001",
            "vehicle_type": Delivery.VehicleType.CAR,
            "vehicle_registration": "RAA 123 A",
            "driver_name": "Peter Driver",
            "driver_phone": "+250788222222",
            "delivery_fee": "7500.00",
            "delivery_notes": "Handle with care.",
        }

    def test_list_deliveries(self):
        self.create_delivery()

        url = reverse("deliveries-list")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_retrieve_delivery(self):
        delivery = self.create_delivery()

        response = self.client.get(
            self.delivery_url(delivery)
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            str(response.data["id"]),
            str(delivery.pk),
        )

    @patch("apps.deliveries.views.record_audit_event")
    def test_create_delivery(self, mock_audit):
        url = reverse("deliveries-list")

        response = self.client.post(
            url,
            self.delivery_data(),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )

        delivery = Delivery.objects.get(
            order_reference="ORDER-001"
        )

        self.assertTrue(
            delivery.delivery_number.startswith("DEL-")
        )

        self.assertTrue(
            delivery.tracking_number.startswith("TRK-")
        )

        self.assertEqual(delivery.created_by, self.manager)

        self.assertEqual(
            delivery.status,
            Delivery.Status.PENDING,
        )

        mock_audit.assert_called_once()

    @patch("apps.deliveries.views.record_audit_event")
    def test_create_delivery_generates_unique_numbers(self, mock_audit):
        url = reverse("deliveries-list")

        first_response = self.client.post(
            url,
            self.delivery_data(),
            format="json",
        )

        second_data = self.delivery_data()
        second_data["order_reference"] = "ORDER-002"

        second_response = self.client.post(
            url,
            second_data,
            format="json",
        )

        self.assertEqual(
            first_response.status_code,
            status.HTTP_201_CREATED,
            first_response.data,
        )

        self.assertEqual(
            second_response.status_code,
            status.HTTP_201_CREATED,
            second_response.data,
        )

        self.assertNotEqual(
            first_response.data["delivery_number"],
            second_response.data["delivery_number"],
        )

        self.assertNotEqual(
            first_response.data["tracking_number"],
            second_response.data["tracking_number"],
        )

        self.assertEqual(mock_audit.call_count, 2)

    @patch("apps.deliveries.views.record_audit_event")
    def test_delivery_creation_creates_initial_status_history(
        self,
        mock_audit,
    ):
        response = self.client.post(
            reverse("deliveries-list"),
            self.delivery_data(),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )

        delivery = Delivery.objects.get(
            order_reference="ORDER-001"
        )

        history = DeliveryStatusHistory.objects.get(
            delivery=delivery
        )

        self.assertEqual(history.previous_status, "")
        self.assertEqual(
            history.new_status,
            Delivery.Status.PENDING,
        )
        self.assertEqual(history.note, "Delivery created.")
        self.assertEqual(history.updated_by, self.manager)

        mock_audit.assert_called_once()

    def test_create_delivery_rejects_address_from_another_customer(self):
        another_customer = Customer.objects.create(
            customer_number="CUS-VIEW0002",
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="Jane",
            last_name="Smith",
            email="jane.view@example.com",
        )

        another_address = CustomerAddress.objects.create(
            customer=another_customer,
            address_type="DELIVERY",
            country="Rwanda",
            district="Kicukiro",
            sector="Kicukiro",
        )

        data = self.delivery_data()
        data["delivery_address"] = str(another_address.pk)

        response = self.client.post(
            reverse("deliveries-list"),
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("delivery_address", response.data)

    def test_create_delivery_rejects_inactive_customer(self):
        self.customer.status = "inactive"
        self.customer.save()

        response = self.client.post(
            reverse("deliveries-list"),
            self.delivery_data(),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("customer", response.data)

    @patch("apps.deliveries.views.record_audit_event")
    def test_update_delivery(self, mock_audit):
        delivery = self.create_delivery()

        response = self.client.patch(
            self.delivery_url(delivery),
            {
                "driver_name": "Updated Driver",
                "delivery_notes": "Updated delivery instructions.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.driver_name,
            "Updated Driver",
        )

        self.assertEqual(
            delivery.delivery_notes,
            "Updated delivery instructions.",
        )

        mock_audit.assert_called_once()

    @patch("apps.deliveries.views.record_audit_event")
    def test_delete_delivery(self, mock_audit):
        delivery = self.create_delivery()

        response = self.client.delete(
            self.delivery_url(delivery)
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Delivery.objects.filter(pk=delivery.pk).exists()
        )

        mock_audit.assert_called_once()

    def test_search_deliveries_by_delivery_number(self):
        delivery = self.create_delivery()

        response = self.client.get(
            reverse("deliveries-list"),
            {"search": delivery.delivery_number},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_search_deliveries_by_tracking_number(self):
        delivery = self.create_delivery()

        response = self.client.get(
            reverse("deliveries-list"),
            {"search": delivery.tracking_number},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_search_deliveries_by_driver_name(self):
        self.create_delivery()

        response = self.client.get(
            reverse("deliveries-list"),
            {"search": "James Driver"},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_order_deliveries_by_created_at(self):
        self.create_delivery()

        response = self.client.get(
            reverse("deliveries-list"),
            {"ordering": "-created_at"},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )


class DeliveryStatusUpdateTests(DeliveryViewSetTests):

    def update_status(self, delivery, data):
        return self.client.post(
            self.status_url(delivery),
            data,
            format="json",
        )

    @patch("apps.deliveries.views.record_audit_event")
    def test_pending_to_preparing(self, mock_audit):
        delivery = self.create_delivery()

        response = self.update_status(
            delivery,
            {
                "status": Delivery.Status.PREPARING,
                "note": "Preparation started.",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.status,
            Delivery.Status.PREPARING,
        )

        history = DeliveryStatusHistory.objects.filter(
            delivery=delivery
        ).latest("created_at")

        self.assertEqual(
            history.previous_status,
            Delivery.Status.PENDING,
        )

        self.assertEqual(
            history.new_status,
            Delivery.Status.PREPARING,
        )

        self.assertEqual(
            history.note,
            "Preparation started.",
        )

        self.assertEqual(history.updated_by, self.manager)

        mock_audit.assert_called_once()

    def test_preparing_to_ready(self):
        delivery = self.create_delivery(
            delivery_number="DEL-TEST000002",
            tracking_number="TRK-TEST000002",
            status=Delivery.Status.PREPARING,
        )

        response = self.update_status(
            delivery,
            {"status": Delivery.Status.READY},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.status,
            Delivery.Status.READY,
        )

    def test_ready_to_assigned(self):
        delivery = self.create_delivery(
            delivery_number="DEL-TEST000003",
            tracking_number="TRK-TEST000003",
            status=Delivery.Status.READY,
        )

        response = self.update_status(
            delivery,
            {"status": Delivery.Status.ASSIGNED},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.status,
            Delivery.Status.ASSIGNED,
        )

    def test_assigned_to_in_transit_sets_dispatched_at(self):
        delivery = self.create_delivery(
            delivery_number="DEL-TEST000004",
            tracking_number="TRK-TEST000004",
            status=Delivery.Status.ASSIGNED,
        )

        self.assertIsNone(delivery.dispatched_at)

        response = self.update_status(
            delivery,
            {"status": Delivery.Status.IN_TRANSIT},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.status,
            Delivery.Status.IN_TRANSIT,
        )

        self.assertIsNotNone(delivery.dispatched_at)

    def test_in_transit_to_delivered_saves_recipient_information(self):
        delivery = self.create_delivery(
            delivery_number="DEL-TEST000005",
            tracking_number="TRK-TEST000005",
            status=Delivery.Status.IN_TRANSIT,
        )

        response = self.update_status(
            delivery,
            {
                "status": Delivery.Status.DELIVERED,
                "recipient_name": "John Doe",
                "recipient_phone": "+250788123456",
                "note": "Received successfully.",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.status,
            Delivery.Status.DELIVERED,
        )

        self.assertEqual(
            delivery.recipient_name,
            "John Doe",
        )

        self.assertEqual(
            delivery.recipient_phone,
            "+250788123456",
        )

        self.assertIsNotNone(delivery.delivered_at)

    def test_in_transit_to_failed_requires_failure_reason(self):
        delivery = self.create_delivery(
            delivery_number="DEL-TEST000006",
            tracking_number="TRK-TEST000006",
            status=Delivery.Status.IN_TRANSIT,
        )

        response = self.update_status(
            delivery,
            {
                "status": Delivery.Status.FAILED,
                "failure_reason": "   ",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("failure_reason", response.data)

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.status,
            Delivery.Status.IN_TRANSIT,
        )

    def test_in_transit_to_failed_with_reason(self):
        delivery = self.create_delivery(
            delivery_number="DEL-TEST000007",
            tracking_number="TRK-TEST000007",
            status=Delivery.Status.IN_TRANSIT,
        )

        response = self.update_status(
            delivery,
            {
                "status": Delivery.Status.FAILED,
                "failure_reason": "Customer was unavailable.",
                "note": "First delivery attempt failed.",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.status,
            Delivery.Status.FAILED,
        )

        self.assertEqual(
            delivery.failure_reason,
            "Customer was unavailable.",
        )

    def test_failed_to_assigned(self):
        delivery = self.create_delivery(
            delivery_number="DEL-TEST000008",
            tracking_number="TRK-TEST000008",
            status=Delivery.Status.FAILED,
            failure_reason="Customer was unavailable.",
        )

        response = self.update_status(
            delivery,
            {"status": Delivery.Status.ASSIGNED},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.status,
            Delivery.Status.ASSIGNED,
        )

    def test_failed_to_returned(self):
        delivery = self.create_delivery(
            delivery_number="DEL-TEST000009",
            tracking_number="TRK-TEST000009",
            status=Delivery.Status.FAILED,
        )

        response = self.update_status(
            delivery,
            {"status": Delivery.Status.RETURNED},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.status,
            Delivery.Status.RETURNED,
        )

    def test_pending_to_cancelled(self):
        delivery = self.create_delivery(
            delivery_number="DEL-TEST000010",
            tracking_number="TRK-TEST000010",
        )

        response = self.update_status(
            delivery,
            {"status": Delivery.Status.CANCELLED},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.status,
            Delivery.Status.CANCELLED,
        )

    def test_reject_same_status(self):
        delivery = self.create_delivery()

        response = self.update_status(
            delivery,
            {"status": Delivery.Status.PENDING},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("status", response.data)

    def test_reject_invalid_status_transition(self):
        delivery = self.create_delivery()

        response = self.update_status(
            delivery,
            {"status": Delivery.Status.DELIVERED},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("status", response.data)

        delivery.refresh_from_db()

        self.assertEqual(
            delivery.status,
            Delivery.Status.PENDING,
        )

    def test_delivered_delivery_cannot_change_status(self):
        delivery = self.create_delivery(
            delivery_number="DEL-TEST000011",
            tracking_number="TRK-TEST000011",
            status=Delivery.Status.DELIVERED,
        )

        response = self.update_status(
            delivery,
            {"status": Delivery.Status.PENDING},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_cancelled_delivery_cannot_change_status(self):
        delivery = self.create_delivery(
            delivery_number="DEL-TEST000012",
            tracking_number="TRK-TEST000012",
            status=Delivery.Status.CANCELLED,
        )

        response = self.update_status(
            delivery,
            {"status": Delivery.Status.PREPARING},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_status_update_creates_history(self):
        delivery = self.create_delivery()

        initial_count = DeliveryStatusHistory.objects.filter(
            delivery=delivery
        ).count()

        response = self.update_status(
            delivery,
            {
                "status": Delivery.Status.PREPARING,
                "note": "Starting preparation.",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        self.assertEqual(
            DeliveryStatusHistory.objects.filter(
                delivery=delivery
            ).count(),
            initial_count + 1,
        )

    def test_invalid_status_does_not_create_history(self):
        delivery = self.create_delivery()

        initial_count = DeliveryStatusHistory.objects.filter(
            delivery=delivery
        ).count()

        response = self.update_status(
            delivery,
            {"status": Delivery.Status.DELIVERED},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(
            DeliveryStatusHistory.objects.filter(
                delivery=delivery
            ).count(),
            initial_count,
        )

    @patch("apps.deliveries.views.record_audit_event")
    def test_status_update_records_audit_event(self, mock_audit):
        delivery = self.create_delivery()

        response = self.update_status(
            delivery,
            {
                "status": Delivery.Status.PREPARING,
                "note": "Preparation started.",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        mock_audit.assert_called_once()


class DeliveryStatusHistoryViewSetTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.manager = User.objects.create_user(
            email="historymanager@example.com",
            password="TestPassword123!",
            role="manager",
        )

        cls.customer = Customer.objects.create(
            customer_number="CUS-HISTVIEW01",
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="Peter",
            last_name="Smith",
            email="peter.history@example.com",
        )

        cls.address = CustomerAddress.objects.create(
            customer=cls.customer,
            address_type="DELIVERY",
            country="Rwanda",
            district="Gasabo",
            sector="Remera",
        )

        cls.delivery = Delivery.objects.create(
            delivery_number="DEL-HISTVIEW01",
            tracking_number="TRK-HISTVIEW01",
            customer=cls.customer,
            delivery_address=cls.address,
        )

        cls.history = DeliveryStatusHistory.objects.create(
            delivery=cls.delivery,
            previous_status=Delivery.Status.PENDING,
            new_status=Delivery.Status.PREPARING,
            note="Preparation started.",
            updated_by=cls.manager,
        )

    def setUp(self):
        self.client.force_authenticate(user=self.manager)

    def test_list_status_history(self):
        response = self.client.get(
            reverse("delivery-status-history-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_retrieve_status_history(self):
        url = reverse(
            "delivery-status-history-detail",
            kwargs={"pk": self.history.pk},
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            str(response.data["id"]),
            str(self.history.pk),
        )

    def test_filter_history_by_delivery(self):
        response = self.client.get(
            reverse("delivery-status-history-list"),
            {"delivery": str(self.delivery.pk)},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_filter_history_by_new_status(self):
        response = self.client.get(
            reverse("delivery-status-history-list"),
            {"new_status": Delivery.Status.PREPARING},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_filter_history_by_previous_status(self):
        response = self.client.get(
            reverse("delivery-status-history-list"),
            {"previous_status": Delivery.Status.PENDING},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_status_history_is_read_only(self):
        response = self.client.post(
            reverse("delivery-status-history-list"),
            {
                "delivery": str(self.delivery.pk),
                "previous_status": Delivery.Status.PENDING,
                "new_status": Delivery.Status.READY,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def test_status_history_cannot_be_deleted(self):
        url = reverse(
            "delivery-status-history-detail",
            kwargs={"pk": self.history.pk},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )


class DeliveryPermissionTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.manager = User.objects.create_user(
            email="permissionmanager@example.com",
            password="TestPassword123!",
            role="manager",
        )

        cls.sales_person = User.objects.create_user(
            email="salesperson@example.com",
            password="TestPassword123!",
            role="sales_person",
        )

        cls.inventory_user = User.objects.create_user(
            email="inventory@example.com",
            password="TestPassword123!",
            role="inventory_manager",
        )

        cls.customer = Customer.objects.create(
            customer_number="CUS-PERM0001",
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="Permission",
            last_name="Test",
            email="permission@example.com",
        )

        cls.address = CustomerAddress.objects.create(
            customer=cls.customer,
            address_type="DELIVERY",
            country="Rwanda",
            district="Gasabo",
            sector="Remera",
        )

        cls.delivery = Delivery.objects.create(
            delivery_number="DEL-PERM0001",
            tracking_number="TRK-PERM0001",
            customer=cls.customer,
            delivery_address=cls.address,
        )

    def test_manager_can_create_delivery(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            reverse("deliveries-list"),
            {
                "customer": str(self.customer.pk),
                "delivery_address": str(self.address.pk),
                "delivery_fee": "5000.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )

    def test_sales_person_can_create_delivery(self):
        self.client.force_authenticate(user=self.sales_person)

        response = self.client.post(
            reverse("deliveries-list"),
            {
                "customer": str(self.customer.pk),
                "delivery_address": str(self.address.pk),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )

    def test_inventory_manager_can_read_deliveries(self):
        self.client.force_authenticate(user=self.inventory_user)

        response = self.client.get(
            reverse("deliveries-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_inventory_manager_cannot_create_delivery(self):
        self.client.force_authenticate(user=self.inventory_user)

        response = self.client.post(
            reverse("deliveries-list"),
            {
                "customer": str(self.customer.pk),
                "delivery_address": str(self.address.pk),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_inventory_manager_cannot_update_delivery(self):
        self.client.force_authenticate(user=self.inventory_user)

        response = self.client.patch(
            reverse(
                "deliveries-detail",
                kwargs={"pk": self.delivery.pk},
            ),
            {"driver_name": "Unauthorized Driver"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

        def test_inventory_manager_cannot_update_delivery_status(self):
         self.client.force_authenticate(user=self.inventory_user)

        response = self.client.post(
            reverse(
                "deliveries-update-status",
                kwargs={"pk": self.delivery.pk},
            ),
            {"status": Delivery.Status.PREPARING},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_unauthenticated_user_cannot_list_deliveries(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(
            reverse("deliveries-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
