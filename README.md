
# Paint Manufacturing & Distribution Management System

## 1. Project Overview

A comprehensive business management backend for a paint
manufacturing, colour mixing, wholesale and distribution
company.

The system manages:

- Paint manufacturing from raw materials.
- Custom paint colour mixing.
- Product catalogue and pricing.
- Suppliers and procurement.
- Inventory and warehouse operations.
- Customer management.
- Retail and wholesale sales.
- Quotations and invoices.
- Payments and refunds.
- Deliveries.
- Business expenses.
- Analytics and reporting.
- Employee accounts and permissions.

## 2. Technology Stack

- Python 3.13
- Django 5.2 LTS
- Django REST Framework
- PostgreSQL
- Simple JWT
- drf-spectacular
- pytest
- React.js (frontend)

## 3. Installation

Clone the repository.

Create and activate a virtual environment.

Install dependencies:

    pip install -r requirements.txt

Create a PostgreSQL database:

    CREATE DATABASE paint_distribution;

Configure the environment variables in .env.

## 4. Database Configuration

The application uses PostgreSQL.

Database name: paint_distribution

Initial timezone: Africa/Kigali

Default currency: RWF

## 5. Authentication

The application uses JWT authentication.

Login endpoint:

    POST /api/v1/auth/token/

Refresh endpoint:

    POST /api/v1/auth/token/refresh/

Authenticated requests must include:

    Authorization: Bearer ACCESS_TOKEN

## 6. Accounts Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/v1/accounts/users/ | List employees |
| POST | /api/v1/accounts/users/ | Create employee |
| GET | /api/v1/accounts/users/{id}/ | Employee details |
| PATCH | /api/v1/accounts/users/{id}/ | Update employee |
| GET | /api/v1/accounts/users/me/ | Current profile |
| PATCH | /api/v1/accounts/users/update-me/ | Update own profile |
| POST | /api/v1/accounts/users/change-password/ | Change password |
| PATCH | /api/v1/accounts/users/{id}/activate/ | Activate employee |
| PATCH | /api/v1/accounts/users/{id}/deactivate/ | Deactivate employee |

Only administrators can list, create and manage other
employees.

Employees can access and update their own profiles.

## 7. API Documentation

Swagger:

    /api/docs/

Redoc:

    /api/redoc/

OpenAPI schema:

    /api/schema/

## 8. Running Tests

Run all tests:

    pytest

Run accounts tests:

    pytest apps/accounts/tests/

Run model tests:

    pytest apps/accounts/tests/test_models.py

Run API tests:

    pytest apps/accounts/tests/test_api.py

## 9. Running the Development Server

    python manage.py runserver

Default development URL:

    http://127.0.0.1:8000/

## 10. Security

- JWT authentication.
- Role-based permissions.
- Password validation.
- Employee account activation and deactivation.
- Environment-based configuration.
- Protected employee information.
