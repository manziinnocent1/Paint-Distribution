
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.audit.models import AuditLog
from apps.customers.models import (
    Customer,
    CustomerAddress,
    CustomerContact,
)


User = get_user_model()


class CustomerViewSetTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.staff_user = User.objects.create_user(
            email="manager@example.com",
            password="TestPassword123!",
            role="manager",
        )

        cls.customer = Customer.objects.create(
            customer_number="CUS-TEST0001",
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            phone_number="+250788123456",
            created_by=cls.staff_user,
        )

        cls.second_customer = Customer.objects.create(
            customer_number="CUS-TEST0002",
            customer_type=Customer.CustomerType.BUSINESS,
            business_name="ABC Construction Ltd",
            email="info@abc.com",
            phone_number="+250788123457",
            created_by=cls.staff_user,
        )

    def setUp(self):
        self.client.force_authenticate(user=self.staff_user)

    def test_list_customers(self):
        url = reverse("customers-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_customer(self):
        url = reverse(
            "customers-detail",
            kwargs={"pk": self.customer.pk},
        )

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            str(response.data["id"]),
            str(self.customer.id),
        )

    @patch("apps.customers.views.record_audit_event")
    def test_create_individual_customer(self, mock_audit):
        url = reverse("customers-list")

        data = {
            "customer_type": Customer.CustomerType.INDIVIDUAL,
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@example.com",
            "phone_number": "+250788123458",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )

        customer = Customer.objects.get(email="jane@example.com")

        self.assertTrue(customer.customer_number.startswith("CUS-"))
        self.assertEqual(customer.created_by, self.staff_user)
        self.assertEqual(customer.first_name, "Jane")

        mock_audit.assert_called_once()

    @patch("apps.customers.views.record_audit_event")
    def test_create_business_customer(self, mock_audit):
        url = reverse("customers-list")

        data = {
            "customer_type": Customer.CustomerType.BUSINESS,
            "business_name": "New Construction Ltd",
            "email": "new@construction.com",
            "phone_number": "+250788123459",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )

        customer = Customer.objects.get(
            email="new@construction.com"
        )

        self.assertTrue(customer.customer_number.startswith("CUS-"))
        self.assertEqual(customer.created_by, self.staff_user)

        mock_audit.assert_called_once()

    def test_customer_number_is_generated_automatically(self):
        url = reverse("customers-list")

        data = {
            "customer_type": Customer.CustomerType.INDIVIDUAL,
            "first_name": "Peter",
            "last_name": "Mugisha",
            "email": "peter@example.com",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )

        self.assertTrue(
            response.data["customer_number"].startswith("CUS-")
        )

    @patch("apps.customers.views.record_audit_event")
    def test_update_customer(self, mock_audit):
        url = reverse(
            "customers-detail",
            kwargs={"pk": self.customer.pk},
        )

        response = self.client.patch(
            url,
            {"first_name": "Updated"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        self.customer.refresh_from_db()

        self.assertEqual(self.customer.first_name, "Updated")
        mock_audit.assert_called_once()

    @patch("apps.customers.views.record_audit_event")
    def test_delete_customer(self, mock_audit):
        url = reverse(
            "customers-detail",
            kwargs={"pk": self.customer.pk},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Customer.objects.filter(pk=self.customer.pk).exists()
        )

        mock_audit.assert_called_once()

    def test_search_customers_by_first_name(self):
        url = reverse("customers-list")

        response = self.client.get(
            url,
            {"search": "John"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_customers_by_business_name(self):
        url = reverse("customers-list")

        response = self.client.get(
            url,
            {"search": "ABC Construction"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_customers_by_status(self):
        url = reverse("customers-list")

        response = self.client.get(
            url,
            {"status": self.customer.status},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_order_customers_by_created_at(self):
        url = reverse("customers-list")

        response = self.client.get(
            url,
            {"ordering": "-created_at"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CustomerAddressViewSetTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.staff_user = User.objects.create_user(
            email="addressmanager@example.com",
            password="TestPassword123!",
            role="manager",
        )

        cls.customer = Customer.objects.create(
            customer_number="CUS-ADDR0001",
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="Alice",
            last_name="Smith",
            email="alice@example.com",
            phone_number="+250788111111",
            created_by=cls.staff_user,
        )

        cls.inactive_customer = Customer.objects.create(
            customer_number="CUS-ADDR0002",
            customer_type=Customer.CustomerType.INDIVIDUAL,
            first_name="Inactive",
            last_name="Customer",
            email="inactive@example.com",
            status=Customer.Status.INACTIVE,
            created_by=cls.staff_user,
        )

    def setUp(self):
        self.client.force_authenticate(user=self.staff_user)

    def get_address_data(self, customer):
        return {
            "customer": str(customer.pk),
            "address_type": CustomerAddress.AddressType.DELIVERY,
            "label": "Main Delivery Address",
            "contact_person": "Alice Smith",
            "contact_phone": "+250788111111",
            "country": "Rwanda",
            "province": "Kigali",
            "district": "Gasabo",
            "sector": "Remera",
            "street_address": "KG 11 Avenue",
            "is_default": True,
            "is_active": True,
        }

    def test_list_customer_addresses(self):
        url = reverse("customer-addresses-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("apps.customers.views.record_audit_event")
    def test_create_customer_address(self, mock_audit):
        url = reverse("customer-addresses-list")

        data = self.get_address_data(self.customer)

        response = self.client.post(url, data, format="json")

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )

        address = CustomerAddress.objects.get(
            customer=self.customer
        )

        self.assertEqual(address.label, "Main Delivery Address")
        mock_audit.assert_called_once()

    def test_cannot_create_address_for_inactive_customer(self):
        url = reverse("customer-addresses-list")

        data = self.get_address_data(self.inactive_customer)

        response = self.client.post(url, data, format="json")

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("customer", response.data)

        self.assertFalse(
            CustomerAddress.objects.filter(
                customer=self.inactive_customer
            ).exists()
        )

    @patch("apps.customers.views.record_audit_event")
    def test_update_customer_address(self, mock_audit):
        address = CustomerAddress.objects.create(
            **self.get_address_data(self.customer)
        )

        url = reverse(
            "customer-addresses-detail",
            kwargs={"pk": address.pk},
        )

        response = self.client.patch(
            url,
            {"label": "Updated Address"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        address.refresh_from_db()

        self.assertEqual(address.label, "Updated Address")
        mock_audit.assert_called_once()

    @patch("apps.customers.views.record_audit_event")
    def test_delete_customer_address(self, mock_audit):
        address = CustomerAddress.objects.create(
            **self.get_address_data(self.customer)
        )

        url = reverse(
            "customer-addresses-detail",
            kwargs={"pk": address.pk},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            CustomerAddress.objects.filter(pk=address.pk).exists()
        )

        mock_audit.assert_called_once()

    def test_search_addresses_by_district(self):
        CustomerAddress.objects.create(
            **self.get_address_data(self.customer)
        )

        url = reverse("customer-addresses-list")

        response = self.client.get(
            url,
            {"search": "Gasabo"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CustomerContactViewSetTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.staff_user = User.objects.create_user(
            email="contactmanager@example.com",
            password="TestPassword123!",
            role="manager",
        )

        cls.customer = Customer.objects.create(
            customer_number="CUS-CON0001",
            customer_type=Customer.CustomerType.BUSINESS,
            business_name="Contact Test Ltd",
            email="business@example.com",
            created_by=cls.staff_user,
        )

        cls.inactive_customer = Customer.objects.create(
            customer_number="CUS-CON0002",
            customer_type=Customer.CustomerType.BUSINESS,
            business_name="Inactive Business Ltd",
            email="inactivebusiness@example.com",
            status=Customer.Status.INACTIVE,
            created_by=cls.staff_user,
        )

    def setUp(self):
        self.client.force_authenticate(user=self.staff_user)

    def get_contact_data(self, customer):
        return {
            "customer": str(customer.pk),
            "full_name": "James Patrick",
            "job_title": "Procurement Manager",
            "email": "james@example.com",
            "phone_number": "+250788222222",
            "is_primary": True,
            "notes": "Main business contact",
        }

    def test_list_customer_contacts(self):
        url = reverse("customer-contacts-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("apps.customers.views.record_audit_event")
    def test_create_customer_contact(self, mock_audit):
        url = reverse("customer-contacts-list")

        data = self.get_contact_data(self.customer)

        response = self.client.post(url, data, format="json")

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )

        contact = CustomerContact.objects.get(
            customer=self.customer
        )

        self.assertEqual(contact.full_name, "James Patrick")
        mock_audit.assert_called_once()

    def test_cannot_create_contact_for_inactive_customer(self):
        url = reverse("customer-contacts-list")

        data = self.get_contact_data(self.inactive_customer)

        response = self.client.post(url, data, format="json")

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("customer", response.data)

        self.assertFalse(
            CustomerContact.objects.filter(
                customer=self.inactive_customer
            ).exists()
        )

    @patch("apps.customers.views.record_audit_event")
    def test_update_customer_contact(self, mock_audit):
        contact = CustomerContact.objects.create(
            **self.get_contact_data(self.customer)
        )

        url = reverse(
            "customer-contacts-detail",
            kwargs={"pk": contact.pk},
        )

        response = self.client.patch(
            url,
            {"job_title": "Operations Manager"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        contact.refresh_from_db()

        self.assertEqual(
            contact.job_title,
            "Operations Manager",
        )

        mock_audit.assert_called_once()

    @patch("apps.customers.views.record_audit_event")
    def test_delete_customer_contact(self, mock_audit):
        contact = CustomerContact.objects.create(
            **self.get_contact_data(self.customer)
        )

        url = reverse(
            "customer-contacts-detail",
            kwargs={"pk": contact.pk},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            CustomerContact.objects.filter(pk=contact.pk).exists()
        )

        mock_audit.assert_called_once()

    def test_search_contacts_by_full_name(self):
        CustomerContact.objects.create(
            **self.get_contact_data(self.customer)
        )

        url = reverse("customer-contacts-list")

        response = self.client.get(
            url,
            {"search": "James Patrick"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_contacts_by_primary_status(self):
        CustomerContact.objects.create(
            **self.get_contact_data(self.customer)
        )

        url = reverse("customer-contacts-list")

        response = self.client.get(
            url,
            {"is_primary": "true"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
