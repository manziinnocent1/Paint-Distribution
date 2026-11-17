import uuid

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from common.models import UUIDTimeStampedModel


class AuditLog(UUIDTimeStampedModel):
    class Action(models.TextChoices):
        CREATE = "CREATE", "Create"
        UPDATE = "UPDATE", "Update"
        DELETE = "DELETE", "Delete"
        LOGIN = "LOGIN", "Login"
        LOGOUT = "LOGOUT", "Logout"
        EXPORT = "EXPORT", "Export"
        IMPORT = "IMPORT", "Import"
        APPROVE = "APPROVE", "Approve"
        REJECT = "REJECT", "Reject"
        OTHER = "OTHER", "Other"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )

    action = models.CharField(
        max_length=20,
        choices=Action.choices,
        db_index=True,
    )

    description = models.TextField()

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )

    object_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        db_index=True,
    )

    content_object = GenericForeignKey(
        "content_type",
        "object_id",
    )

    object_repr = models.CharField(
        max_length=255,
        blank=True,
    )

    changes = models.JSONField(
        default=dict,
        blank=True,
        help_text="Previous and new values for changed fields.",
    )

    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Additional context about the action.",
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
    )

    user_agent = models.TextField(
        blank=True,
    )

    class Meta:
        db_table = "audit_logs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["action", "created_at"],
                name="audit_action_created_idx",
            ),
            models.Index(
                fields=["actor", "created_at"],
                name="audit_actor_created_idx",
            ),
            models.Index(
                fields=["content_type", "object_id"],
                name="audit_object_idx",
            ),
        ]

    def __str__(self):
        return f"{self.action} - {self.object_repr or self.description}"