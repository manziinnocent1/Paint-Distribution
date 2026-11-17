from rest_framework.routers import DefaultRouter

from apps.catalog.views import (
    CategoryViewSet,
    BrandViewSet,
    ProductViewSet,
    ProductVariantViewSet,
    ProductImageViewSet,
    ProductAttributeViewSet,
    ProductAttributeValueViewSet,
)


router = DefaultRouter()

router.register(
    "categories",
    CategoryViewSet,
    basename="catalog-categories",
)

router.register(
    "brands",
    BrandViewSet,
    basename="catalog-brands",
)

router.register(
    "products",
    ProductViewSet,
    basename="catalog-products",
)

router.register(
    "variants",
    ProductVariantViewSet,
    basename="catalog-variants",
)

router.register(
    "images",
    ProductImageViewSet,
    basename="catalog-images",
)

router.register(
    "attributes",
    ProductAttributeViewSet,
    basename="catalog-attributes",
)

router.register(
    "attribute-values",
    ProductAttributeValueViewSet,
    basename="catalog-attribute-values",
)

urlpatterns = router.urls