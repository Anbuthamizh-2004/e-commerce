# 🍽️ FoodieHub — Full-Stack Food E-Commerce

A complete food ordering platform built with **React**, **Spring Boot (Java)**, and **MySQL**.

---

## 🏗️ Architecture Overview

```
food-ecommerce/
├── frontend/          # React 18 SPA
│   └── src/
│       ├── components/   Navbar, Footer, ProductCard
│       ├── pages/        Home, Menu, ProductDetail, Cart, Checkout, Orders, Admin
│       ├── context/      AuthContext, CartContext
│       └── services/     Axios API client
│
├── backend/           # Spring Boot 3.2 REST API
│   └── src/main/java/com/foodstore/
│       ├── controller/   Auth, Product, Category, Cart, Order, Address
│       ├── service/      Auth, Product, Cart, Order
│       ├── repository/   JPA Repositories
│       ├── model/        User, Product, Category, Order, OrderItem, CartItem, Address
│       ├── dto/          AuthDTO, OrderDTO
│       ├── security/     JWT, UserDetailsService, Filter
│       └── config/       SecurityConfig
│
└── database/
    └── schema.sql     Full MySQL schema + seed data
```

---

## ✨ Features

### Customer Features
- 🔐 JWT Authentication (Register / Login)
- 🛍️ Browse full menu with categories
- 🔍 Real-time search & filters (Veg/Non-Veg, sort by price/rating)
- 🛒 Persistent cart (synced with backend)
- 📦 Multi-step checkout with address management
- 📍 Delivery address CRUD
- 💳 COD or Online payment selection
- 🎟️ Coupon code support
- 📋 Order history with live status tracking
- ⭐ Product ratings, calories, prep time display

### Admin Features
- 📊 Dashboard with revenue & order stats
- 📦 Order management with status updates
- 🍕 Product inventory view
- 🔒 Role-based access (ADMIN / CUSTOMER)

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

---

### Step 1: Database Setup

```sql
-- Run in MySQL:
mysql -u root -p < database/schema.sql
```

This creates the database, all tables, and seeds with:
- 8 categories (Pizza, Burgers, Biryani, Sushi, Desserts, etc.)
- 20 products with images, ratings, calories
- 3 coupon codes
- 1 admin user

---

### Step 2: Backend Setup

```bash
cd backend

# Edit database credentials:
# src/main/resources/application.properties
# Change: spring.datasource.password=your_password_here

# Build and run:
mvn spring-boot:run
```

Backend starts on **http://localhost:8080**

#### Admin Credentials (pre-seeded):
- Email: `admin@foodstore.com`
- Password: `admin123`

---

### Step 3: Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend starts on **http://localhost:3000**

The `"proxy": "http://localhost:8080"` in package.json proxies API calls automatically.

---

## 🔌 REST API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Products (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | All active products |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/{id}` | Single product |
| GET | `/api/products/search?q=` | Search products |
| GET | `/api/products/category/{id}` | By category |

### Cart (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item `{productId, quantity}` |
| PUT | `/api/cart/{productId}` | Update quantity |
| DELETE | `/api/cart/{productId}` | Remove item |
| DELETE | `/api/cart` | Clear cart |

### Orders (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | My orders |
| GET | `/api/orders/{id}` | Order detail |

### Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/admin/all` | All orders |
| PATCH | `/api/orders/{id}/status` | Update status |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Soft-delete |

---

## 🎟️ Coupon Codes (Pre-seeded)

| Code | Discount | Min Order |
|------|----------|-----------|
| `WELCOME50` | 50% off (max ₹150) | ₹200 |
| `FLAT100` | ₹100 off | ₹500 |
| `SAVE20` | 20% off (max ₹200) | ₹300 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, Lucide Icons |
| Styling | CSS-in-JS, Google Fonts (Playfair Display + DM Sans) |
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth | JWT (jjwt 0.11.5) |
| Database | MySQL 8.0, Hibernate ORM |
| Build | Maven, Create React App |

---

## 📸 Pages

- `/` — Home with hero, categories, featured dishes
- `/menu` — Full menu with search, filters, categories
- `/product/:id` — Product detail with add-to-cart
- `/cart` — Cart with quantities, pricing summary
- `/checkout` — Address + payment + order placement
- `/orders` — Order history with status tracking
- `/order-success/:id` — Confirmation page
- `/login` & `/register` — Auth pages
- `/admin` — Admin dashboard (ADMIN role only)

---

## 🔧 Configuration

### application.properties
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/food_ecommerce
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

app.jwt.secret=your-256-bit-secret-key
app.jwt.expiration=86400000  # 24 hours in ms

app.cors.allowed-origins=http://localhost:3000
```

---

## 🧪 Testing the API

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@foodstore.com","password":"admin123"}'

# Get products (public)
curl http://localhost:8080/api/products
```
