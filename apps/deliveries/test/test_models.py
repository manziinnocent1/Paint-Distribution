import pytest

from apps.customers.models import Customer, CustomerAddress
from apps.deliveries.models import (
    Delivery,
    DeliveryStatusHistory,
)


@pytest.mark.django_db
def test_create_delivery():
    customer = Customer.objects.create(
        customer_number="CUS-DEL001",
        customer_type=Customer.CustomerType.BUSINESS,
        business_name="Construction Company Ltd",
        phone_number="+250788000000",
    )

    address = CustomerAddress.objects.create(
        customer=customer,
        address_type=CustomerAddress.AddressType.DELIVERY,
        country="Rwanda",
        district="Gasabo",
        sector="Remera",
    )

    delivery = Delivery.objects.create(
        delivery_number="DEL-TEST001",
        tracking_number="TRK-TEST001",
        customer=customer,
        delivery_address=address,
        delivery_fee="5000.00",
        vehicle_type=Delivery.VehicleType.MOTORCYCLE,
    )

    assert delivery.pk is not None
    assert delivery.status == Delivery.Status.PENDING
    assert delivery.customer == customer
    assert delivery.delivery_address == address


@pytest.mark.django_db
def test_delivery_status_history():
    customer = Customer.objects.create(
        customer_number="CUS-DEL002",
        customer_type=Customer.CustomerType.INDIVIDUAL,
        first_name="John",
        phone_number="+250788000000",
    )

    address = CustomerAddress.objects.create(
        customer=customer,
        address_type=CustomerAddress.AddressType.HOME,
        country="Rwanda",
        district="Gasabo",
    )

    delivery = Delivery.objects.create(
        delivery_number="DEL-TEST002",
        tracking_number="TRK-TEST002",
        customer=customer,
        delivery_address=address,
    )

    history = DeliveryStatusHistory.objects.create(
        delivery=delivery,
        previous_status=Delivery.Status.PENDING,
        new_status=Delivery.Status.PREPARING,
        note="Preparing customer order.",
    )

    assert delivery.status_history.count() == 1
    assert history.new_status == Delivery.Status.PREPARING