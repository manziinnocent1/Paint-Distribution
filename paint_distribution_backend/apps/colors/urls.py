from rest_framework.routers import DefaultRouter

from apps.colors.views import (
    ColorFamilyViewSet,
    ColorViewSet,
    ColorFormulaViewSet,
    ColorFormulaIngredientViewSet,
)


router = DefaultRouter()

router.register(
    "families",
    ColorFamilyViewSet,
    basename="color-families",
)

router.register(
    "colors",
    ColorViewSet,
    basename="colors",
)

router.register(
    "formulas",
    ColorFormulaViewSet,
    basename="color-formulas",
)

router.register(
    "formula-ingredients",
    ColorFormulaIngredientViewSet,
    basename="color-formula-ingredients",
)

urlpatterns = router.urls