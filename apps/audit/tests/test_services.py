import pytest

from apps.audit.models import AuditLog
from apps.audit.services import record_audit_event
from apps.accounts.models import User


@pytest.mark.django_db
def test_record_audit_event():
    user = User.objects.create_user(
        email="manager@example.com",
        password="StrongPassword123!",
        first_name="Test",
        last_name="Manager",
        role=User.Role.MANAGER,
    )

    log = record_audit_event(
        actor=user,
        action=AuditLog.Action.UPDATE,
        description="Updated product price.",
        changes={
            "price": {
                "old": "15000.00",
                "new": "17000.00",
            }
        },
        metadata={"application": "catalog"},
    )

    assert log.actor == user
    assert log.action == AuditLog.Action.UPDATE
    assert log.changes["price"]["old"] == "15000.00"
    assert log.metadata["application"] == "catalog"