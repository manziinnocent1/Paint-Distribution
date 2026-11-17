from django.contrib.contenttypes.models import ContentType

from apps.audit.models import AuditLog


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
    Pass changes as a JSON-serializable dictionary.
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
        changes=changes or {},
        metadata=metadata or {},
        ip_address=ip_address,
        user_agent=user_agent or "",
    )