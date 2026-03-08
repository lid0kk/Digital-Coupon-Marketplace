# 🎫 Digital Coupon Marketplace

A premium, secure, and fully containerized backend and frontend solution for a digital marketplace. This system supports both direct customer sales and a dedicated REST API for external resellers, with strict business logic enforcement and atomic transaction handling.

---

## 🚀 Key Features

### ⚖️ Strict Pricing Engine
- **Server-Side Derived Pricing**: `minimum_sell_price` is calculated dynamically: `cost_price * (1 + margin_percentage / 100)`.
- **Integrity Protection**: Pricing fields are never accepted from external client input, preventing tampering.

### 🛡️ Secure Reseller API
- **Bearer Token Authentication**: All reseller endpoints are protected via `Authorization: Bearer <token>`.
- **Price Validation**: Resellers must provide a `reseller_price` that is equal to or greater than the `minimum_sell_price`.

### ⚛️ Atomic Transactions
- **Double-Purchase Prevention**: Uses Prisma database transactions to ensure that marking a product as "sold" and returning the coupon value is an atomic operation.

### 🎨 Premium Frontend
- **Dual Modes**: Integrated Admin and Customer views.
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons for a sleek, responsive experience.

### 🐳 Production-Ready Dockerization
- Multi-container setup (MySQL + Node/Express + Nginx/React) with automated schema synchronization.

---

## 🛠️ Architecture & Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Frontend**: React (Vite), TypeScript, Tailwind CSS
- **Database**: MySQL 8.0
- **Infrastructure**: Docker & Docker Compose

---

## 🏁 Getting Started

### 1. Run with Docker (Recommended)
The fastest way to get up and running. This command builds all images and starts the database, backend, and frontend.
```bash
docker-compose up --build -d
```

### 2. Access the Application
- **Frontend App**: [http://localhost:5173](http://localhost:5173) (Includes Customer Store & Admin Dashboard)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## 📖 API Specification

### Reseller API (v1)
All calls require `Authorization: Bearer reseller_secret`.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/products` | `GET` | List all unsold products |
| `/api/v1/products/:id` | `GET` | Get details of a specific product |
| `/api/v1/products/:id/purchase` | `POST` | Purchase a product (Requires `reseller_price` in body) |

**Sample Purchase Request Body:**
```json
{
  "reseller_price": 125.00
}
```

### Admin API
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/admin/products` | `GET` | View all products (including sold ones) |
| `/api/v1/admin/products` | `POST` | Create a new coupon product |
| `/api/v1/admin/products/:id` | `PUT` | Update product details |
| `/api/v1/admin/products/:id` | `DELETE` | Delete a product |

---

## 🧪 Validation & Error Handling
The system uses standardized error formats:
```json
{
  "error_code": "PRODUCT_ALREADY_SOLD",
  "message": "Product already sold"
}
```
**Common Error Codes:**
- `PRODUCT_NOT_FOUND` (404)
- `PRODUCT_ALREADY_SOLD` (409)
- `RESELLER_PRICE_TOO_LOW` (400)
- `UNAUTHORIZED` (401)
