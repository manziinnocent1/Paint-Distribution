
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentication
    path(
        "api/v1/auth/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),

    path(
        "api/v1/auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    # Accounts
    path(
        "api/v1/accounts/",
        include("apps.accounts.urls"),
    ),
    
    # Analytics
    path(
    "api/v1/analytics/",
    include("apps.analytics.urls"),
    ),
    
    # Audit
    
    path(
        "api/v1/audit/",
        include("apps.audit.urls"),
    ),
    
    # Catalog

    path(
        "api/v1/catalog/",
        include("apps.catalog.urls"),
    ),
    
    # Colors
    
    path(
    "api/v1/colors/",
    include("apps.colors.urls"),
    ),
    
    # Customers

   path(
    "api/v1/customers/",
    include("apps.customers.urls"),
    ),
   
    # Deliveries

   path(
    "api/v1/deliveries/",
    include("apps.deliveries.urls"),
    ),
   
   path(
    "api/v1/expenses/",
    include("apps.expenses.urls"),
),

path(
    "api/v1/inventory/",
    include("apps.inventory.urls"),
),

path(
        "api/v1/notifications/",
        include("apps.notifications.urls"),
    ),
    path(
        "api/v1/pricing/",
        include("apps.pricing.urls"),
    ),
    path(
        "api/v1/payments/",
        include("apps.payments.urls"),
    ),
    
    path(
    "api/v1/",
    include("apps.suppliers.urls"),
),
    path(
    "api/v1/",
    include("apps.procurement.urls"),
),

path(
    "api/v1/",
    include("apps.sales.urls"),
),

    # API documentation
    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),

    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(
            url_name="schema",
        ),
        name="swagger-ui",
    ),

    path(
        "api/redoc/",
        SpectacularRedocView.as_view(
            url_name="schema",
        ),
        name="redoc",
    ),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
