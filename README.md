# Sathak Workshop – Ecommerce Backend

Simple full-stack workshop API using **Node.js + TypeScript + Express + TypeORM + PostgreSQL**.

## Folder structure

```
src/
  entity.ts       # User & Product entities
  repository.ts   # Database access
  usecase.ts      # Business logic (auth, OTP, CRUD)
  controller.ts   # Request / response handlers
  route.ts        # API routes
  server.ts       # App entry point
  data-source.ts  # TypeORM + Postgres config
  mail.ts         # SMTP email (OTP)
```

## Setup

```bash
npm install
npm run dev
```

Server runs at `http://localhost:3000`.

## How to get Gmail App Password (for SMTP)

Gmail will **not** allow your normal password for SMTP. Use an **App Password**.

1. Open [Google Account](https://myaccount.google.com/)
2. Go to **Security**
3. Turn on **2-Step Verification** (required)
4. Go back to **Security** → search **App passwords**  
   Direct link: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
5. Select app: **Mail**, device: **Other** (name it `workshop`)
6. Click **Generate**
7. Copy the **16-character password** (looks like `abcd efgh ijkl mnop`)
8. Put it in `.env` (spaces optional):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop
```

> Use the App Password in `SMTP_PASS`, **not** your Gmail login password.

## Auth flow

1. `POST /api/users` → creates user and emails OTP  
2. `POST /api/users/verify-otp` → verifies account  
3. `POST /api/users/login` → returns JWT  

Forgot password:

1. `POST /api/users/forgot-password` → emails OTP  
2. `POST /api/users/reset-password` → set new password with OTP  

## User endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create user |
| POST | `/api/users/login` | Login |
| POST | `/api/users/verify-otp` | Verify OTP |
| POST | `/api/users/forgot-password` | Forgot password |
| POST | `/api/users/reset-password` | Reset password |
| GET | `/api/users` | Get all users |
| GET | `/api/users/id/:id` | Get by id |
| GET | `/api/users/name/:name` | Get by name |
| GET | `/api/users/email/:email` | Get by email |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Create user body

```json
{
  "name": "Mohamed",
  "email": "mohamed@example.com",
  "phoneNumber": "9876543210",
  "password": "secret123"
}
```

### Login body

```json
{
  "email": "mohamed@example.com",
  "password": "secret123"
}
```

### Verify OTP body

```json
{
  "email": "mohamed@example.com",
  "otp": "123456"
}
```

### Forgot password body

```json
{
  "email": "mohamed@example.com"
}
```

### Reset password body

```json
{
  "email": "mohamed@example.com",
  "otp": "123456",
  "newPassword": "newSecret123"
}
```

## Product endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` | Create product |
| GET | `/api/products` | Get all products |
| GET | `/api/products/id/:id` | Get by id |
| GET | `/api/products/name/:name` | Get by name |
| GET | `/api/products/category/:category` | Get by category |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Create product body

```json
{
  "productName": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "category": "Electronics",
  "price": 799
}
```
