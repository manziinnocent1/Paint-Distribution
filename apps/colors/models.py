from decimal import Decimal
import uuid

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class UUIDTimestampModel(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ColorFamily(UUIDTimestampModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        db_table = "colors_families"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Color(UUIDTimestampModel):
    class ColorType(models.TextChoices):
        STANDARD = "STANDARD", "Standard"
        CUSTOM = "CUSTOM", "Custom"
        RAL = "RAL", "RAL"
        OTHER = "OTHER", "Other"

    class BaseType(models.TextChoices):
        WHITE = "WHITE", "White base"
        PASTEL = "PASTEL", "Pastel base"
        MEDIUM = "MEDIUM", "Medium base"
        DEEP = "DEEP", "Deep base"
        CLEAR = "CLEAR", "Clear base"
        UNIVERSAL = "UNIVERSAL", "Universal base"
        NOT_APPLICABLE = "N_A", "Not applicable"

    name = models.CharField(max_length=120, db_index=True)

    code = models.CharField(
        max_length=60,
        unique=True,
        db_index=True,
    )

    color_type = models.CharField(
        max_length=20,
        choices=ColorType.choices,
        default=ColorType.STANDARD,
        db_index=True,
    )

    family = models.ForeignKey(
        ColorFamily,
        on_delete=models.PROTECT,
        related_name="colors",
        null=True,
        blank=True,
    )

    base_type = models.CharField(
        max_length=20,
        choices=BaseType.choices,
        default=BaseType.NOT_APPLICABLE,
    )

    hex_code = models.CharField(
        max_length=7,
        blank=True,
        help_text="Example: #FFFFFF.",
    )

    ral_code = models.CharField(
        max_length=30,
        blank=True,
    )

    description = models.TextField(blank=True)

    is_mixable = models.BooleanField(
        default=True,
        help_text="Whether this colour can be produced through colour mixing.",
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_colors",
    )

    class Meta:
        db_table = "colors_colors"
        ordering = ["name"]
        indexes = [
            models.Index(
                fields=["color_type", "is_active"],
                name="colors_type_active_idx",
            ),
            models.Index(
                fields=["family", "is_active"],
                name="colors_family_active_idx",
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"


class ColorFormula(UUIDTimestampModel):
    """
    Confidential formula used to reproduce a particular colour.

    Formula quantities should use a consistent unit for each formula.
    """

    color = models.ForeignKey(
        Color,
        on_delete=models.PROTECT,
        related_name="formulas",
    )

    name = models.CharField(max_length=150)

    version = models.PositiveIntegerField(default=1)

    paint_product = models.ForeignKey(
        "catalog.Product",
        on_delete=models.PROTECT,
        related_name="color_formulas",
        null=True,
        blank=True,
    )

    paint_variant = models.ForeignKey(
        "catalog.ProductVariant",
        on_delete=models.PROTECT,
        related_name="color_formulas",
        null=True,
        blank=True,
    )

    batch_size = models.DecimalField(
        max_digits=14,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0001"))],
        help_text="Amount of paint this formula produces.",
    )

    batch_unit = models.CharField(
        max_length=30,
        default="litre",
        help_text="Example: litre, kilogram.",
    )

    notes = models.TextField(blank=True)

    is_active = models.BooleanField(default=True, db_index=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_color_formulas",
    )

    class Meta:
        db_table = "colors_formulas"
        ordering = ["color__name", "-version"]
        constraints = [
            models.UniqueConstraint(
                fields=["color", "version"],
                name="colors_unique_formula_version",
            ),
        ]

    def __str__(self):
        return f"{self.color.name} - Formula v{self.version}"


class ColorFormulaIngredient(UUIDTimestampModel):
    formula = models.ForeignKey(
        ColorFormula,
        on_delete=models.CASCADE,
        related_name="ingredients",
    )

    ingredient_name = models.CharField(
        max_length=150,
        help_text="Example: Yellow tint, red oxide, blue pigment.",
    )

    ingredient_code = models.CharField(
        max_length=60,
        blank=True,
    )

    quantity = models.DecimalField(
        max_digits=14,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0001"))],
    )

    unit = models.CharField(
        max_length=30,
        default="ml",
        help_text="Example: ml, gram, kilogram.",
    )

    sequence = models.PositiveIntegerField(default=0)

    notes = models.TextField(blank=True)

    class Meta:
        db_table = "colors_formula_ingredients"
        ordering = ["sequence", "ingredient_name"]

    def __str__(self):
        return f"{self.ingredient_name} - {self.quantity} {self.unit}"