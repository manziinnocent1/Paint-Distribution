from decimal import Decimal

import pytest

from apps.colors.models import (
    ColorFamily,
    Color,
    ColorFormula,
    ColorFormulaIngredient,
)


@pytest.mark.django_db
def test_create_color():
    family = ColorFamily.objects.create(
        name="Neutral",
        description="Neutral paint colours.",
    )

    color = Color.objects.create(
        name="Pure White",
        code="CLR-WHT-001",
        color_type=Color.ColorType.STANDARD,
        family=family,
        base_type=Color.BaseType.WHITE,
        hex_code="#FFFFFF",
    )

    assert color.pk is not None
    assert color.family == family
    assert color.hex_code == "#FFFFFF"


@pytest.mark.django_db
def test_create_color_formula_and_ingredient():
    color = Color.objects.create(
        name="Ocean Blue",
        code="CLR-BLU-001",
        hex_code="#0000FF",
    )

    formula = ColorFormula.objects.create(
        color=color,
        name="Ocean Blue Formula",
        version=1,
        batch_size="20.0000",
        batch_unit="litre",
    )

    ingredient = ColorFormulaIngredient.objects.create(
        formula=formula,
        ingredient_name="Blue pigment",
        ingredient_code="PIG-BLU",
        quantity="150.0000",
        unit="ml",
    )

    # Reload so the value is a Decimal from the DB, not the raw string
    ingredient.refresh_from_db()

    assert formula.ingredients.count() == 1
    assert ingredient.formula == formula
    assert ingredient.quantity == Decimal("150")