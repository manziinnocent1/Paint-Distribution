import json

from django.contrib.contenttypes.models import ContentType
from django.core.serializers.json import DjangoJSONEncoder

from apps.audit.models import AuditLog


def _json_safe(value):
    """
    Convert values such as UUID, Decimal and datetime into plain
    JSON-compatible data so they can be stored in a JSONField.
    """
    return json.loads(json.dumps(value or {}, cls=DjangoJSONEncoder))


def record_audit_event(
    *,
    actor=None,
    action,
    description,
    instance=None,
    changes=None,
    metadata=None,
    ip_address=None,
    user_agent="",
):
    """
    Create an audit record for an application event.

    Pass an instance when the action concerns a database object.
    Pass changes as a dictionary. UUIDs, Decimals and datetimes are
    converted automatically.
    """

    content_type = None
    object_id = None
    object_repr = ""

    if instance is not None:
        content_type = ContentType.objects.get_for_model(instance)
        object_id = str(instance.pk)
        object_repr = str(instance)[:255]

    return AuditLog.objects.create(
        actor=actor if getattr(actor, "is_authenticated", False) else None,
        action=action,
        description=description,
        content_type=content_type,
        object_id=object_id,
        object_repr=object_repr,
        changes=_json_safe(changes),
        metadata=_json_safe(metadata),
        ip_address=ip_address,
        user_agent=user_agent or "",
    )