# Restaurant Management API

<div align="center">

**A modern, scalable REST API for restaurant management with comprehensive features**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-Documentation-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

[Live Documentation](http://localhost:3000/api-docs) • [Quick Start](#quick-start) • [API Reference](#api-reference) • [Examples](#examples)

</div>

---

## Overview

Professional-grade restaurant management system built with modern Node.js stack. Handles everything from menu management to sales analytics with enterprise-level security and comprehensive API documentation.

### Key Features

| Feature | Description |
|---------|-------------|
| **Authentication** | JWT-based auth with role-based access control |
| **Menu System** | Full CRUD with categories, search, and filtering |
| **Order Management** | Dine-in, takeaway, and delivery order processing |
| **Table Management** | Real-time status tracking and reservations |
| **Billing System** | Automated invoicing with payment tracking |
| **Analytics** | Sales reporting and business insights |
| **Documentation** | Interactive Swagger/OpenAPI documentation |
| **Security** | Rate limiting, validation, and secure headers |

---

## Quick Start

### Prerequisites

```bash
Node.js 18+    MySQL 8.0+    npm/yarn
```

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd restaurant-management-api

# 2. Install dependencies
npm install

# 3. Environment setup
cp .env.example .env
# Edit .env file with your configuration

# 4. Database setup
npm run db:generate
npm run db:push
npm run db:seed

# 5. Start server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="mysql://username:password@localhost:3306/restaurant_db"
JWT_SECRET="your-super-secure-jwt-secret-key-here"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Ready to Test

Once running, access:
- **API Base:** `http://localhost:3000/api/v1`
- **Documentation:** `http://localhost:3000/api-docs`
- **Health Check:** `http://localhost:3000/health`

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user | No |
| `POST` | `/auth/login` | User login | No |
| `GET` | `/auth/profile` | Get user profile | Yes |

### Menu Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/menu` | Get menu items | No |
| `POST` | `/menu` | Create menu item | Yes (Admin/Manager) |
| `GET` | `/menu/:id` | Get specific item | No |
| `PUT` | `/menu/:id` | Update menu item | Yes (Admin/Manager) |
| `DELETE` | `/menu/:id` | Delete menu item | Yes (Admin/Manager) |

### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/categories` | Get all categories | No |
| `POST` | `/categories` | Create category | Yes (Admin/Manager) |
| `GET` | `/categories/:id` | Get specific category | No |
| `PATCH` | `/categories/:id` | Update category | Yes (Admin/Manager) |
| `DELETE` | `/categories/:id` | Delete category | Yes (Admin/Manager) |

### Order Processing

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/orders/create` | Create new order | Yes |
| `GET` | `/orders` | Get all orders | Yes |
| `GET` | `/orders/:id` | Get specific order | Yes |

### Table Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/tables` | Get all tables | Yes |
| `POST` | `/tables` | Create table | Yes (Admin/Manager) |
| `PUT` | `/tables/:id` | Update table | Yes (Admin/Manager) |
| `DELETE` | `/tables/:id` | Delete table | Yes (Admin/Manager) |

### Invoice System

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/invoices/create` | Create invoice | Yes |
| `GET` | `/invoices` | Get all invoices | Yes |
| `PATCH` | `/invoices/:id/status` | Update status | Yes (Admin/Manager) |

### Sales Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/sales/total` | Get total sales | Yes (Admin/Manager) |
| `GET` | `/sales/by-table` | Sales by table | Yes (Admin/Manager) |
| `POST` | `/sales/by-day` | Daily sales | Yes (Admin/Manager) |

---

## Examples

### Login & Authentication

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "admin123"
  }'

# Response
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "Admin", "role": "ADMIN" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create Menu Item

```bash
curl -X POST http://localhost:3000/api/v1/menu \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Margherita Pizza",
    "description": "Fresh tomatoes, mozzarella, basil",
    "price": 12.99,
    "categoryId": 1
  }'
```

### Process Order

```bash
curl -X POST http://localhost:3000/api/v1/orders/create \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "tableId": 5,
    "orderType": "PLACE",
    "menuItems": [
      {
        "menuItemId": 1,
        "quantity": 2,
        "price": 12.99
      }
    ]
  }'
```

---

## Authentication & Roles

### Test Users

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | `admin@restaurant.com` | `admin123` | Full system access |
| **Manager** | `manager@restaurant.com` | `manager123` | Operations & reporting |
| **Staff** | `staff@restaurant.com` | `staff123` | Basic operations |

### Using JWT Tokens

1. **Login** to get JWT token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Access protected** endpoints based on your role

---

## Architecture

### Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MySQL with Prisma ORM
- **Authentication:** JWT with bcrypt
- **Documentation:** Swagger/OpenAPI 3.0
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Morgan & Winston

### Database Schema

```
Users ←→ Orders ←→ OrderItems ←→ MenuItems ←→ Categories
  ↓        ↓
Tables   Invoices
```

### Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt (12 rounds)
- **Rate Limiting** (100 requests per 15 minutes)
- **Input Validation** and sanitization
- **CORS Protection** with configurable origins
- **Security Headers** via Helmet middleware

---

## Deployment

### Development

```bash
npm run dev          # Start development server
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed sample data
```

### Production

```bash
# Environment
NODE_ENV=production
JWT_SECRET=<secure-64-char-secret>
DATABASE_URL=<production-db-url>

# Commands
npm ci --only=production
npm run db:generate
npm start
```

### Docker Deployment

#### Single Container

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Generate Prisma client
RUN npm run db:generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S restaurant -u 1001
RUN chown -R restaurant:nodejs /app
USER restaurant

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

#### Docker Compose (Full Stack)

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://restaurant_user:restaurant_pass@db:3306/restaurant_db
      - JWT_SECRET=your-super-secure-jwt-secret-key
      - FRONTEND_URL=http://localhost:3000
    depends_on:
      - db
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
    networks:
      - restaurant-network

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: restaurant_db
      MYSQL_USER: restaurant_user
      MYSQL_PASSWORD: restaurant_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/init:/docker-entrypoint-initdb.d
    restart: unless-stopped
    networks:
      - restaurant-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - restaurant-network

volumes:
  mysql_data:

networks:
  restaurant-network:
    driver: bridge
```

#### Docker Commands

```bash
# Build and run
docker build -t restaurant-api .
docker run -p 3000:3000 restaurant-api

# Using Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Scale application
docker-compose up -d --scale app=3

# Stop services
docker-compose down
```

#### Production Docker Setup

```bash
# 1. Build production image
docker build -t restaurant-api:prod --target production .

# 2. Run with environment file
docker run -d \
  --name restaurant-api \
  --env-file .env.production \
  -p 3000:3000 \
  --restart unless-stopped \
  restaurant-api:prod

# 3. Setup reverse proxy (nginx)
docker run -d \
  --name nginx-proxy \
  -p 80:80 -p 443:443 \
  --link restaurant-api \
  nginx:alpine
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Apply schema changes to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/new-feature`)
3. **Commit** changes (`git commit -am 'Add feature'`)
4. **Push** to branch (`git push origin feature/new-feature`)
5. **Create** Pull Request

---



---


**Built with modern Node.js ecosystem for scalable restaurant management**

