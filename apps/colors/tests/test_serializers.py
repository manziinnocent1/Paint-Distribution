from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from apps.colors.models import (
    ColorFamily,
    Color,
    ColorFormula,
    ColorFormulaIngredient,
)

from apps.colors.serializers import (
    ColorFamilySerializer,
    ColorSerializer,
    ColorFormulaSerializer,
    ColorFormulaIngredientSerializer,
)


User = get_user_model()


class ColorFamilySerializerTests(APITestCase):

    def setUp(self):
        self.family = ColorFamily(
            name="Neutral Colours",
            description="Neutral paint colour collection.",
            is_active=True,
        )

    def test_serializes_expected_fields(self):
        serializer = ColorFamilySerializer(self.family)

        expected_fields = {
            "id",
            "name",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        }

        self.assertEqual(
            set(serializer.data.keys()),
            expected_fields,
        )

    def test_serializes_family_name(self):
        serializer = ColorFamilySerializer(self.family)

        self.assertEqual(
            serializer.data["name"],
            "Neutral Colours",
        )

    def test_serializes_family_description(self):
        serializer = ColorFamilySerializer(self.family)

        self.assertEqual(
            serializer.data["description"],
            "Neutral paint colour collection.",
        )

    def test_serializes_is_active(self):
        serializer = ColorFamilySerializer(self.family)

        self.assertTrue(serializer.data["is_active"])

    def test_id_is_read_only(self):
        serializer = ColorFamilySerializer()

        self.assertTrue(serializer.fields["id"].read_only)

    def test_timestamps_are_read_only(self):
        serializer = ColorFamilySerializer()

        self.assertTrue(
            serializer.fields["created_at"].read_only
        )

        self.assertTrue(
            serializer.fields["updated_at"].read_only
        )

    def test_accepts_valid_family_data(self):
        data = {
            "name": "Warm Colours",
            "description": "Warm paint colours.",
            "is_active": True,
        }

        serializer = ColorFamilySerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_rejects_missing_family_name(self):
        data = {
            "description": "Family without a name.",
            "is_active": True,
        }

        serializer = ColorFamilySerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)


class ColorSerializerTests(APITestCase):

    def setUp(self):
        self.user = User(
            email="manager@example.com",
            role="manager",
        )

        self.family = ColorFamily(
            name="Neutral Colours",
            description="Neutral colours.",
            is_active=True,
        )

        self.color = Color(
            name="Pure White",
            code="CLR-WHT-001",
            color_type=Color.ColorType.STANDARD,
            family=self.family,
            base_type=Color.BaseType.WHITE,
            hex_code="#FFFFFF",
            ral_code="RAL 9010",
            description="Standard white paint.",
            is_mixable=True,
            is_active=True,
            created_by=self.user,
        )

    def test_serializes_expected_fields(self):
        serializer = ColorSerializer(self.color)

        expected_fields = {
            "id",
            "name",
            "code",
            "color_type",
            "family",
            "family_name",
            "base_type",
            "hex_code",
            "ral_code",
            "description",
            "is_mixable",
            "is_active",
            "created_by",
            "created_by_email",
            "created_at",
            "updated_at",
        }

        self.assertEqual(
            set(serializer.data.keys()),
            expected_fields,
        )

    def test_serializes_color_name(self):
        serializer = ColorSerializer(self.color)

        self.assertEqual(
            serializer.data["name"],
            "Pure White",
        )

    def test_serializes_color_code(self):
        serializer = ColorSerializer(self.color)

        self.assertEqual(
            serializer.data["code"],
            "CLR-WHT-001",
        )

    def test_serializes_family_name(self):
        serializer = ColorSerializer(self.color)

        self.assertEqual(
            serializer.data["family_name"],
            "Neutral Colours",
        )

    def test_serializes_created_by_email(self):
        serializer = ColorSerializer(self.color)

        self.assertEqual(
            serializer.data["created_by_email"],
            "manager@example.com",
        )

    def test_family_name_is_none_without_family(self):
        self.color.family = None

        serializer = ColorSerializer(self.color)

        self.assertIsNone(
            serializer.data["family_name"]
        )

    def test_created_by_email_is_none_without_user(self):
        self.color.created_by = None

        serializer = ColorSerializer(self.color)

        self.assertIsNone(
            serializer.data["created_by_email"]
        )

    def test_accepts_valid_hex_code(self):
        serializer = ColorSerializer(
            data={
                "name": "Ocean Blue",
                "code": "CLR-BLU-001",
                "hex_code": "#123ABC",
            }
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_converts_lowercase_hex_code_to_uppercase(self):
        serializer = ColorSerializer(
            data={
                "name": "Ocean Blue",
                "code": "CLR-BLU-002",
                "hex_code": "#aabbcc",
            }
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

        self.assertEqual(
            serializer.validated_data["hex_code"],
            "#AABBCC",
        )

    def test_rejects_hex_code_without_hash(self):
        serializer = ColorSerializer(
            data={
                "name": "Invalid Colour",
                "code": "CLR-INV-001",
                "hex_code": "FFFFFF",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("hex_code", serializer.errors)

    def test_rejects_hex_code_with_wrong_length(self):
        serializer = ColorSerializer(
            data={
                "name": "Invalid Colour",
                "code": "CLR-INV-002",
                "hex_code": "#FFF",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("hex_code", serializer.errors)

    def test_rejects_hex_code_with_invalid_characters(self):
        serializer = ColorSerializer(
            data={
                "name": "Invalid Colour",
                "code": "CLR-INV-003",
                "hex_code": "#GGGGGG",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("hex_code", serializer.errors)

    def test_accepts_blank_hex_code(self):
        serializer = ColorSerializer(
            data={
                "name": "Natural Colour",
                "code": "CLR-NAT-001",
                "hex_code": "",
            }
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_created_by_is_read_only(self):
        serializer = ColorSerializer()

        self.assertTrue(
            serializer.fields["created_by"].read_only
        )

    def test_id_is_read_only(self):
        serializer = ColorSerializer()

        self.assertTrue(
            serializer.fields["id"].read_only
        )

    def test_timestamps_are_read_only(self):
        serializer = ColorSerializer()

        self.assertTrue(
            serializer.fields["created_at"].read_only
        )

        self.assertTrue(
            serializer.fields["updated_at"].read_only
        )

    def test_accepts_valid_color_type(self):
        serializer = ColorSerializer(
            data={
                "name": "Custom Red",
                "code": "CLR-RED-001",
                "color_type": Color.ColorType.CUSTOM,
                "base_type": Color.BaseType.DEEP,
            }
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_rejects_invalid_color_type(self):
        serializer = ColorSerializer(
            data={
                "name": "Invalid Type",
                "code": "CLR-TYPE-001",
                "color_type": "INVALID",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("color_type", serializer.errors)


class ColorFormulaIngredientSerializerTests(APITestCase):

    def setUp(self):
        self.family = ColorFamily.objects.create(
            name="Neutral Colours",
        )

        self.color = Color.objects.create(
            name="Pure White",
            code="CLR-WHT-001",
            family=self.family,
        )

        self.formula = ColorFormula.objects.create(
            color=self.color,
            name="Pure White Formula",
            version=1,
            batch_size=Decimal("20.0000"),
            batch_unit="litre",
        )

        self.ingredient = ColorFormulaIngredient.objects.create(
            formula=self.formula,
            ingredient_name="White pigment",
            ingredient_code="PIG-WHT-001",
            quantity=Decimal("2.5000"),
            unit="kg",
            sequence=1,
            notes="Main white pigment.",
        )

    def test_serializes_expected_fields(self):
        serializer = ColorFormulaIngredientSerializer(
            self.ingredient
        )

        expected_fields = {
            "id",
            "formula",
            "ingredient_name",
            "ingredient_code",
            "quantity",
            "unit",
            "sequence",
            "notes",
            "created_at",
            "updated_at",
        }

        self.assertEqual(
            set(serializer.data.keys()),
            expected_fields,
        )

    def test_serializes_ingredient_name(self):
        serializer = ColorFormulaIngredientSerializer(
            self.ingredient
        )

        self.assertEqual(
            serializer.data["ingredient_name"],
            "White pigment",
        )

    def test_serializes_ingredient_quantity(self):
        serializer = ColorFormulaIngredientSerializer(
            self.ingredient
        )

        self.assertEqual(
            Decimal(serializer.data["quantity"]),
            Decimal("2.5000"),
        )

    def test_serializes_ingredient_unit(self):
        serializer = ColorFormulaIngredientSerializer(
            self.ingredient
        )

        self.assertEqual(
            serializer.data["unit"],
            "kg",
        )

    def test_accepts_valid_ingredient_data(self):
        data = {
            "formula": str(self.formula.id),
            "ingredient_name": "Blue pigment",
            "ingredient_code": "PIG-BLU-001",
            "quantity": "0.5000",
            "unit": "kg",
            "sequence": 2,
            "notes": "Blue pigment.",
        }

        serializer = ColorFormulaIngredientSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_rejects_zero_quantity(self):
        data = {
            "formula": str(self.formula.id),
            "ingredient_name": "White pigment",
            "quantity": "0",
            "unit": "kg",
        }

        serializer = ColorFormulaIngredientSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("quantity", serializer.errors)

    def test_rejects_negative_quantity(self):
        data = {
            "formula": str(self.formula.id),
            "ingredient_name": "White pigment",
            "quantity": "-1.0000",
            "unit": "kg",
        }

        serializer = ColorFormulaIngredientSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("quantity", serializer.errors)

    def test_id_is_read_only(self):
        serializer = ColorFormulaIngredientSerializer()

        self.assertTrue(
            serializer.fields["id"].read_only
        )

    def test_timestamps_are_read_only(self):
        serializer = ColorFormulaIngredientSerializer()

        self.assertTrue(
            serializer.fields["created_at"].read_only
        )

        self.assertTrue(
            serializer.fields["updated_at"].read_only
        )


class ColorFormulaSerializerTests(APITestCase):

    def setUp(self):
        self.family = ColorFamily.objects.create(
            name="Neutral Colours",
        )

        self.color = Color.objects.create(
            name="Pure White",
            code="CLR-WHT-001",
            family=self.family,
        )

        self.formula = ColorFormula.objects.create(
            color=self.color,
            name="Pure White Formula",
            version=1,
            batch_size=Decimal("20.0000"),
            batch_unit="litre",
            notes="Standard white formula.",
            is_active=True,
        )

        self.ingredient = ColorFormulaIngredient.objects.create(
            formula=self.formula,
            ingredient_name="White pigment",
            ingredient_code="PIG-WHT-001",
            quantity=Decimal("2.5000"),
            unit="kg",
            sequence=1,
        )

    def test_serializes_expected_fields(self):
        serializer = ColorFormulaSerializer(self.formula)

        expected_fields = {
            "id",
            "color",
            "color_name",
            "name",
            "version",
            "paint_product",
            "paint_variant",
            "batch_size",
            "batch_unit",
            "notes",
            "is_active",
            "created_by",
            "ingredients",
            "created_at",
            "updated_at",
        }

        self.assertEqual(
            set(serializer.data.keys()),
            expected_fields,
        )

    def test_serializes_formula_name(self):
        serializer = ColorFormulaSerializer(self.formula)

        self.assertEqual(
            serializer.data["name"],
            "Pure White Formula",
        )

    def test_serializes_color_name(self):
        serializer = ColorFormulaSerializer(self.formula)

        self.assertEqual(
            serializer.data["color_name"],
            "Pure White",
        )

    def test_serializes_batch_size(self):
        serializer = ColorFormulaSerializer(self.formula)

        self.assertEqual(
            Decimal(serializer.data["batch_size"]),
            Decimal("20.0000"),
        )

    def test_serializes_batch_unit(self):
        serializer = ColorFormulaSerializer(self.formula)

        self.assertEqual(
            serializer.data["batch_unit"],
            "litre",
        )

    def test_ingredients_are_read_only(self):
        serializer = ColorFormulaSerializer()

        self.assertTrue(
            serializer.fields["ingredients"].read_only
        )

    def test_serializes_nested_ingredients(self):
        serializer = ColorFormulaSerializer(self.formula)

        ingredients = serializer.data["ingredients"]

        self.assertEqual(len(ingredients), 1)
        self.assertEqual(
            ingredients[0]["ingredient_name"],
            "White pigment",
        )

        self.assertEqual(
            Decimal(ingredients[0]["quantity"]),
            Decimal("2.5000"),
        )

    def test_accepts_valid_formula_data_without_product(self):
        data = {
            "color": str(self.color.id),
            "name": "Premium White Formula",
            "version": 2,
            "batch_size": "25.0000",
            "batch_unit": "litre",
            "notes": "Premium formula.",
            "is_active": True,
        }

        serializer = ColorFormulaSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_rejects_zero_batch_size(self):
        data = {
            "color": str(self.color.id),
            "name": "Invalid Formula",
            "version": 2,
            "batch_size": "0",
            "batch_unit": "litre",
        }

        serializer = ColorFormulaSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("batch_size", serializer.errors)

    def test_rejects_negative_batch_size(self):
        data = {
            "color": str(self.color.id),
            "name": "Invalid Formula",
            "version": 2,
            "batch_size": "-5.0000",
            "batch_unit": "litre",
        }

        serializer = ColorFormulaSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("batch_size", serializer.errors)

    def test_id_is_read_only(self):
        serializer = ColorFormulaSerializer()

        self.assertTrue(
            serializer.fields["id"].read_only
        )

    def test_created_by_is_read_only(self):
        serializer = ColorFormulaSerializer()

        self.assertTrue(
            serializer.fields["created_by"].read_only
        )

    def test_timestamps_are_read_only(self):
        serializer = ColorFormulaSerializer()

        self.assertTrue(
            serializer.fields["created_at"].read_only
        )

        self.assertTrue(
            serializer.fields["updated_at"].read_only
        )