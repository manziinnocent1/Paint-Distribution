from rest_framework.routers import DefaultRouter

from apps.expenses.views import (
    ExpenseCategoryViewSet,
    ExpenseViewSet,
)


router = DefaultRouter()

router.register(
    "categories",
    ExpenseCategoryViewSet,
    basename="expense-categories",
)

router.register(
    "expenses",
    ExpenseViewSet,
    basename="expenses",
)

urlpatterns = router.urls