# Paint Distribution Management System

A modern, full-stack business management platform designed to streamline paint distribution operations, including inventory management, procurement, sales, customer relationships, supplier management, pricing, payments, deliveries, and business analytics.

The platform is being developed with a **Django REST Framework backend** and a **React + TypeScript frontend**, following a modular architecture designed for maintainability, scalability, and efficient business operations.

## Project Overview

The Paint Distribution Management System aims to provide a centralized platform for managing the complete lifecycle of a paint distribution business.

### Core Features

- **User & Access Management:** Authentication, user roles, and permissions.
- **Product Catalog:** Manage paint products, categories, brands, and product information.
- **Color Management:** Manage color families, colors, formulas, and ingredients.
- **Inventory Management:** Monitor stock levels and inventory movements.
- **Procurement:** Manage purchasing operations and procurement records.
- **Supplier Management:** Maintain supplier information and relationships.
- **Customer Management:** Manage customer profiles and business relationships.
- **Sales Management:** Handle sales transactions and sales records.
- **Pricing Management:** Organize product pricing and pricing rules.
- **Payment Management:** Manage payment records and transactions.
- **Delivery Management:** Coordinate and track deliveries.
- **Expense Management:** Record and monitor business expenses.
- **Analytics & Reporting:** Provide business insights and operational reports.
- **Audit & Notifications:** Support activity tracking and system notifications.

## Technology Stack

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL (database configuration dependent)
- JWT authentication
- drf-spectacular (API documentation)
- Pytest (automated testing)

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS (planned)
- React Router (planned)
- Axios (planned)
- TanStack Query (planned)
- Zustand (planned)
- Recharts (planned)
- Lucide React (planned)

## Repository Structure

```text
Color-Paint-Distribution/
│
├── paint_distribution_backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── analytics/
│   │   ├── audit/
│   │   ├── catalog/
│   │   ├── colors/
│   │   ├── customers/
│   │   ├── deliveries/
│   │   ├── expenses/
│   │   ├── inventory/
│   │   ├── notifications/
│   │   ├── payments/
│   │   ├── pricing/
│   │   ├── procurement/
│   │   ├── sales/
│   │   └── suppliers/
│   │
│   ├── common/
│   ├── config/
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
│
├── paint-distribution-frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Python 3.12 or a compatible version for the backend dependencies
- Node.js (LTS recommended)
- npm
- Git
- PostgreSQL, if using PostgreSQL locally

### 1. Clone the Repository

```bash
git clone https://github.com/manziinnocent1/Paint-Distribution.git
cd Paint-Distribution
```

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd paint_distribution_backend
```

Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your environment variables and database settings according to the backend configuration.

Apply database migrations:

```bash
python manage.py migrate
```

Start the development server:

```bash
python manage.py runserver
```

Backend development server:

`http://127.0.0.1:8000/`

API documentation:

- Swagger UI: `http://127.0.0.1:8000/api/docs/`
- ReDoc: `http://127.0.0.1:8000/api/redoc/`

### 3. Set Up the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd paint-distribution-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the local URL printed by Vite, typically:

`http://localhost:5173/`

## Development Workflow

The project uses a monorepo structure, keeping the backend and frontend in one Git repository while maintaining separate application directories.

- Backend development takes place in `paint_distribution_backend/`.
- Frontend development takes place in `paint-distribution-frontend/`.
- API communication connects the React frontend to the Django REST Framework backend.
- Each backend application is organized into its own modular Django app.

## Testing

Run backend tests from the backend directory:

```bash
pytest
```

## API Documentation

The backend uses drf-spectacular to provide interactive API documentation.

- Swagger UI: `/api/docs/`
- ReDoc: `/api/redoc/`

## Security

- Never commit environment files containing secrets.
- Keep database credentials and API keys out of source control.
- Use environment variables for sensitive configuration.
- Keep virtual environments and dependency folders out of Git.

## Project Status

**Development in progress.**

The Django backend is under active development, and the React frontend is being established as the user-facing application.

## License

A license has not yet been specified for this project.
