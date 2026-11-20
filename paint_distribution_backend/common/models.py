
import uuid

from django.db import models


class UUIDModel(models.Model):
    """
    Abstract model providing UUID primary keys.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    class Meta:
        abstract = True


class TimeStampedModel(models.Model):
    """
    Abstract model tracking creation and modification times.
    """

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        abstract = True


class UUIDTimeStampedModel(UUIDModel, TimeStampedModel):
    """
    Common base model for most business records.
    """

    class Meta:
        abstract = True
