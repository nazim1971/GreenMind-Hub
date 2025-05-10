
---

# 🌱 GreenMind-Hub Server

## 🔗 Live Links

* 🚀 **Client**: [greenmind-hub.vercel.app](https://greenmind-hub.vercel.app/)
* 🖥️ **Server**: [greenmind-server.vercel.app](https://greenmind-server.vercel.app/)

---

A RESTful **API server** for **GreenMind-Hub**, a community platform where users share, vote on, and manage eco-friendly ideas. Built with **Next.js (client)** and **Express.js (server)**, this backend handles authentication, moderation, commenting, voting, and secure payments.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT, bcrypt
* **Validation:** Zod
* **Uploads:** Multer + Cloudinary
* **Payments:** SSLCommerz
* **Email Service:** Nodemailer

---

## 🌟 Core Features

* 🔐 **JWT Authentication** for members and admins
* 📝 **CRUD operations** for ideas, comments, votes
* 🛡️ **Admin tools** for content moderation
* 🖼️ **Cloudinary image uploads**
* 📧 **Secure password reset via email**
* 💳 **SSLCommerz payment integration**

---

## ⚙️ Prerequisites

* **Node.js:** ≥ 18.x
* **PostgreSQL:** ≥ 16.x

---

## 🚀 Getting Started (Local Development)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nazim1971/GreenMind-Hub.git
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root with the following:

   ```env
   NODE_ENV=development
   PORT=5000

   DATABASE_URL=your_postgres_url

   BCRYPT_SALT=10

   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=3d
   REFRESH_TOKEN_SECRET=your_refresh_secret
   REFRESH_TOKEN_EXPIRES_IN=30d

   RESET_PASS_TOKEN=your_reset_token
   RESET_PASS_EXPIRES_IN=10m
   RESET_PASS_LINK=http://localhost:3000/reset-password

   NODE_EMAIL=your_email@example.com
   NODE_EMAIL_PASS=your_email_password

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   STORE_ID=your_ssl_store_id
   STORE_PASS=your_ssl_store_password
   SUCCESS_URL=http://localhost:3000/payment/success
   CANCEL_URL=http://localhost:3000/payment/cancel
   FAIL_URL=http://localhost:3000/payment/fail
   SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
   SSL_VALIDATIOIN_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
   ```

4. **Run Prisma migrations:**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**

   ```bash
   pnpm dev
   ```

---

## 📡 API Documentation

### 🔐 Auth API

| Method | API Endpoint                | Description               |
| ------ | --------------------------- | ------------------------- |
| POST   | `/api/auth/login`           | Login user                |
| POST   | `/api/auth/send-email`      | Send password reset email |
| POST   | `/api/auth/reset-password`  | Reset password            |
| POST   | `/api/auth/refresh-token`   | Refresh access token      |
| PATCH  | `/api/auth/change-password` | Change password           |

---

### 👤 User API

```ts
GET /api/user           // Get current user profile
```

---

### 📂 Category API

```ts
POST /api/category      // Admin: Create category
GET  /api/category      // Get all categories
```

---

### 💡 Idea API

```ts
POST   /api/idea/draft              // Save draft with image
POST   /api/idea/                   // Submit idea
GET    /api/idea/me                 // Get own ideas
GET    /api/idea/                   // Get all ideas
GET    /api/idea/:id                // Get idea by ID
PUT    /api/idea/:id                // Update idea
DELETE /api/idea/:id                // Delete idea
GET    /api/idea/admin/all-ideas    // Admin: View all ideas
```

---

### 💬 Comment API

```ts
POST   /api/comment/        // Add comment
GET    /api/comment/:id     // Get comments for an idea
DELETE /api/comment/:id     // Delete comment
```

---

### 🗳️ Vote API

```ts
POST   /api/vote/                    // Add or update vote
DELETE /api/vote/:ideaId             // Remove vote
GET    /api/vote/stats/:ideaId       // Get vote stats
GET    /api/vote/:ideaId             // Get user's vote on idea
GET    /api/vote/ideas/by-votes      // Get top-voted ideas
```

---

### 💳 Payment API

```ts
POST   /api/payments/                    // Initiate payment
GET    /api/payments/                    // Admin: View all payments
GET    /api/payments/member              // Member: View own payments
GET    /api/payments/details/:paymentId  // View payment details
PATCH  /api/payments/validate            // Validate payment
```

---

## 👨‍💻 Developer

**Md. Nazim Uddin**
🔗 [GitHub Profile](https://github.com/nazim1971)
📧 [nazimmuddin10@gmail.com](mailto:nazimmuddin10@gmail.com)

---

