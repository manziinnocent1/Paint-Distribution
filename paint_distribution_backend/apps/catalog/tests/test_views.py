import pytest

from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.catalog.models import Category


@pytest.mark.django_db
def test_manager_can_create_category():
    manager = User.objects.create_user(
        email="manager@example.com",
        password="StrongPassword123!",
        first_name="Test",
        last_name="Manager",
        role=User.Role.MANAGER,
    )

    client = APIClient()
    client.force_authenticate(user=manager)

    response = client.post(
        "/api/v1/catalog/categories/",
        {
            "name": "Exterior Paint",
            "slug": "exterior-paint",
            "description": "Paint for exterior surfaces.",
            "is_active": True,
        },
        format="json",
    )

    assert response.status_code == 201
    assert Category.objects.filter(
        slug="exterior-paint"
    ).exists()


@pytest.mark.django_db
def test_sales_person_can_read_but_not_create_category():
    salesperson = User.objects.create_user(
        email="sales@example.com",
        password="StrongPassword123!",
        first_name="Test",
        last_name="Salesperson",
        role=User.Role.SALES_PERSON,
    )

    client = APIClient()
    client.force_authenticate(user=salesperson)

    read_response = client.get("/api/v1/catalog/categories/")

    create_response = client.post(
        "/api/v1/catalog/categories/",
        {
            "name": "Primers",
            "slug": "primers",
        },
        format="json",
    )

    assert read_response.status_code == 200
    assert create_response.status_code == 403