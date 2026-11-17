import pytest

from apps.audit.models import AuditLog
from apps.accounts.models import User


@pytest.mark.django_db
def test_audit_log_creation():
    user = User.objects.create_user(
        email="manager@example.com",
        password="StrongPassword123!",
        first_name="Test",
        last_name="Manager",
        role=User.Role.MANAGER,
    )

    log = AuditLog.objects.create(
        actor=user,
        action=AuditLog.Action.CREATE,
        description="Created a paint product.",
        object_repr="Premium Wall Paint",
        changes={
            "name": {
                "old": None,
                "new": "Premium Wall Paint",
            }
        },
    )

    assert log.pk is not None
    assert log.actor == user
    assert log.action == AuditLog.Action.CREATE
    assert log.changes["name"]["new"] == "Premium Wall Paint"


@pytest.mark.django_db
def test_audit_log_can_exist_without_actor():
    log = AuditLog.objects.create(
        action=AuditLog.Action.OTHER,
        description="System-generated event.",
    )

    assert log.actor is None