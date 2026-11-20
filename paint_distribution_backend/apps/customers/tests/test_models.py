import pytest

from apps.customers.models import (
    Customer,
    CustomerAddress,
    CustomerContact,
)


@pytest.mark.django_db
def test_create_individual_customer():
    customer = Customer.objects.create(
        customer_number="CUS-TEST001",
        customer_type=Customer.CustomerType.INDIVIDUAL,
        first_name="John",
        last_name="Doe",
        phone_number="+250788000000",
    )

    assert customer.pk is not None
    assert str(customer) == "John Doe"


@pytest.mark.django_db
def test_create_business_customer_with_address_and_contact():
    customer = Customer.objects.create(
        customer_number="CUS-TEST002",
        customer_type=Customer.CustomerType.BUSINESS,
        business_name="ABC Construction Ltd",
        phone_number="+250788111111",
    )

    address = CustomerAddress.objects.create(
        customer=customer,
        address_type=CustomerAddress.AddressType.BUSINESS,
        label="Main Office",
        country="Rwanda",
        district="Gasabo",
        sector="Remera",
        street_address="KG Street",
        is_default=True,
    )

    contact = CustomerContact.objects.create(
        customer=customer,
        full_name="Jane Smith",
        job_title="Procurement Manager",
        phone_number="+250788222222",
        is_primary=True,
    )

    assert customer.addresses.count() == 1
    assert customer.contacts.count() == 1
    assert address.customer == customer
    assert contact.customer == customer