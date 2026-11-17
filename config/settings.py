
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


def env_bool(name, default=False):
    return os.getenv(name, str(default)).lower() in ("true", "1", "yes")


def env_list(name, default=""):
    return [
        item.strip()
        for item in os.getenv(name, default).split(",")
        if item.strip()
    ]


SECRET_KEY = os.getenv("SECRET_KEY", "unsafe-development-key")

DEBUG = env_bool("DEBUG", True)

ALLOWED_HOSTS = env_list(
    "ALLOWED_HOSTS",
    "localhost,127.0.0.1",
)

INSTALLED_APPS = [
    # Django applications
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party applications
    "rest_framework",
    "rest_framework_simplejwt",
    "django_filters",
    "corsheaders",
    "drf_spectacular",

    # Local applications
    "apps.accounts.apps.AccountsConfig",
    "apps.analytics.apps.AnalyticsConfig",
    "apps.audit.apps.AuditConfig",
    "apps.catalog.apps.CatalogConfig",
    "apps.colors.apps.ColorsConfig",
    "apps.customers.apps.CustomersConfig",
    "apps.deliveries.apps.DeliveriesConfig",
    "apps.expenses.apps.ExpensesConfig",
    "apps.inventory.apps.InventoryConfig",
    "apps.notifications.apps.NotificationsConfig",
    "apps.pricing.apps.PricingConfig",
    "apps.payments.apps.PaymentsConfig",
    "apps.suppliers.apps.SuppliersConfig",
    "apps.procurement.apps.ProcurementConfig",
    "apps.sales.apps.SalesConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# PostgreSQL database configuration

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "paint_distribution"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD", ""),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
        "CONN_MAX_AGE": 60,
    }
}

# Custom user model
AUTH_USER_MODEL = "accounts.User"

# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 10,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization

LANGUAGE_CODE = "en-us"

TIME_ZONE = os.getenv("TIME_ZONE", "Africa/Kigali")

USE_I18N = True

USE_TZ = True

# Static files

STATIC_URL = "static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = []

# Media files

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"

# Default primary key

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Django REST Framework

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],

    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],

    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",

    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],

    "DEFAULT_PAGINATION_CLASS": (
        "rest_framework.pagination.PageNumberPagination"
    ),

    "PAGE_SIZE": 20,

    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],

    "DEFAULT_THROTTLE_RATES": {
        "anon": "30/minute",
        "user": "120/minute",
    },

    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],

    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ],
}

# JWT configuration

from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

INSTALLED_APPS += [
    "rest_framework_simplejwt.token_blacklist",
]

# API documentation

SPECTACULAR_SETTINGS = {
    "TITLE": "Paint Distribution & Manufacturing API",
    "DESCRIPTION": (
        "Backend API for paint manufacturing, colour mixing, "
        "inventory management, purchasing, sales and distribution."
    ),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
}

# React frontend configuration

CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173",
)

CORS_ALLOW_CREDENTIALS = True

# Security defaults

SECURE_CONTENT_TYPE_NOSNIFF = True

X_FRAME_OPTIONS = "DENY"

SESSION_COOKIE_HTTPONLY = True

CSRF_COOKIE_HTTPONLY = True

SPECTACULAR_SETTINGS = {
    "TITLE": "Paint Distribution API",
    "DESCRIPTION": "Backend API for the Color Paint Distribution system.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,

    # Skip /api/v1/ when deriving the group name from the URL
    "SCHEMA_PATH_PREFIX": r"/api/v[0-9]+",

    # Optional: control the display order and add descriptions
    "TAGS": [
        {"name": "accounts", "description": "Users, profiles and passwords"},
        {"name": "analytics", "description": "Reports and dashboards"},
        {"name": "audit", "description": "Audit logs"},
        {"name": "catalog", "description": "Products, variants, categories and brands"},
        {"name": "colors", "description": "Colour management and mixing"},
        {"name": "customers", "description": "Customers and addresses"},
        {"name": "deliveries", "description": "Deliveries and tracking"},
        {"name": "expenses", "description": "Expenses"},
        {"name": "inventory", "description": "Warehouses, stock levels and movements"},
        {"name": "notifications", "description": "Notifications"},
        {"name": "pricing", "description": "Pricing rules"},
        {"name": "payments", "description": "Payments"},
        {"name": "suppliers", "description": "Suppliers"},
        # {"name": "procurement", "description": "Purchase requests, orders and goods receipts"},
        {"name": "sales", "description": "Quotations, sales and returns"},
    ],
}
