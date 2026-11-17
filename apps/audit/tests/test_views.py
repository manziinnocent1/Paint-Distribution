import pytest

from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.audit.models import AuditLog


@pytest.mark.django_db
def test_audit_logs_are_available_to_manager():
    manager = User.objects.create_user(
        email="manager@example.com",
        password="StrongPassword123!",
        first_name="Test",
        last_name="Manager",
        role=User.Role.MANAGER,
    )

    AuditLog.objects.create(
        actor=manager,
        action=AuditLog.Action.CREATE,
        description="Created a category.",
    )

    client = APIClient()
    client.force_authenticate(user=manager)

    response = client.get("/api/v1/audit/logs/")

    assert response.status_code == 200
    assert response.data["count"] == 1


@pytest.mark.django_db
def test_sales_person_cannot_access_audit_logs():
    salesperson = User.objects.create_user(
        email="sales@example.com",
        password="StrongPassword123!",
        first_name="Test",
        last_name="Salesperson",
        role=User.Role.SALES_PERSON,
    )

    client = APIClient()
    client.force_authenticate(user=salesperson)

    response = client.get("/api/v1/audit/logs/")

    assert response.status_code == 403