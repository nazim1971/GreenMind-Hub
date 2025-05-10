
# 🌱 GreenMind-Hub Server

## 🔗 Live Links

- 🚀 **Client**: [GreenMind-Hub Live Client](https://greenmind-hub.vercel.app/)
- 🖥️ **Server**: [GreenMind-Hub Live Server](https://greenmind-server.vercel.app/)

---

A RESTful API for GreenMind-Hub — a Next.js-powered community platform where users share and vote on sustainable ideas. This backend service handles authentication, idea moderation, commenting, voting, and secure payments.

---

### 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, bcrypt
- **Validation:** Zod
- **Uploads:** Multer + Cloudinary
- **Payments:** SSLCommerz
- **Mail:** Nodemailer

---

### 🌟 Core Features

- **JWT Authentication:** Secure login for members and admins
- **CRUD Operations:** Manage ideas, comments, votes
- **Admin Endpoints:** Moderate ideas with feedback
- **Image Uploads:** Cloudinary support for idea images
- **Email System:** Password reset via secure email link
- **Payment Integration:** Handle member payments with SSLCommerz

---

### ⚙️ Prerequisites

- **Node.js:** ≥18.x  
- **PostgreSQL:** ≥16.x

---

### 🚀 Getting Started (Local Development)

1. Clone the server repository:
   ```bash
   git clone https://github.com/nazim1971/GreenMind-Hub.git
````

2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Create a `.env` file in the root and add the following:

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

4. Run Prisma migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the server:

   ```bash
   pnpm dev
   ```

---

### 🔐 Auth API Endpoints

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| POST   | `/api/auth/login`           | Login user               |
| POST   | `/api/auth/send-email`      | Send reset password link |
| POST   | `/api/auth/reset-password`  | Reset password           |
| POST   | `/api/auth/refresh-token`   | Refresh access token     |
| PATCH  | `/api/auth/change-password` | Change user password     |

---

### 👤 User API

```ts
path: '/api/user'
```

---

### 📂 Category API

```ts
POST   /api/category/        // Admin: Create category  
GET    /api/category/        // Get all categories
```

---

### 💡 Idea API

```ts
POST   /api/idea/draft                   // Draft idea with image  
POST   /api/idea/                        // Submit idea  
GET    /api/idea/me                      // Get own ideas  
GET    /api/idea/                        // Get all ideas  
GET    /api/idea/:id                     // Get idea by ID  
PUT    /api/idea/:id                     // Update idea  
DELETE /api/idea/:id                     // Delete idea  
GET    /api/idea/admin/all-ideas         // Admin: Review all ideas
```

---

### 💬 Comment API

```ts
POST   /api/comment/                     // Add comment  
GET    /api/comment/:id                  // Get comments by idea ID  
DELETE /api/comment/:id                  // Delete comment
```

---

### 🗳️ Vote API

```ts
POST    /api/vote/                       // Add/Update vote  
DELETE  /api/vote/:ideaId                // Remove vote  
GET     /api/vote/stats/:ideaId          // Get vote stats  
GET     /api/vote/:ideaId                // Get user's vote  
GET     /api/vote/ideas/by-votes         // Get ideas sorted by vote
```

---

### 💳 Payment API

```ts
POST    /api/payments/                   // Create payment  
GET     /api/payments/                   // Admin: View all payments  
GET     /api/payments/member             // Member: View own payments  
GET     /api/payments/details/:paymentId // Get payment details  
PATCH   /api/payments/validate           // Validate payment
```

---

### 👨‍💻 Developer

**Md. Nazim Uddin**
🔗 [GitHub Profile](https://github.com/nazim1971)
📧 Email: [nazimmuddin10@gmail.com](mailto:nazimmuddin10@gmail.com)

