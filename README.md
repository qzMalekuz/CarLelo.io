# 🚗 CarLelo.io

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

A robust and secure backend system for **CarLelo.io**, a modern car rental booking platform. Built with a focus on clean API contracts, secure authentication, and resilient database modeling.

---

## ✨ Features

- **Secure Authentication:** JWT-based user authentication and bcrypt password hashing.
- **Booking Management:** Create, view, update, and manage car rentals.
- **Authorization Constraints:** Strict ownership checks—users can only modify or view their own bookings.
- **Business Logic Enforcement:** Automatic validation for rental constraints (e.g., maximum 365 days, transparent cost calculations).
- **Automated Database Setup:** Auto-table generation on startup for `users` and `bookings` with connected cascading schemas.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js (with TypeScript)
- **Database:** PostgreSQL (using `pg`)
- **Security:** JSON Web Tokens (JWT) & bcrypt

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd "CarRental in TS"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**  
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/carrental"
   PORT=3000
   JWT_SECRET="your_strong_jwt_secret"
   SALT_ROUND=10
   ```

4. **Run the Server**
   ```bash
   npm run dev
   ```
   *The server will automatically connect to your PostgreSQL instance and provision the required tables.*

## 📡 API Reference

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate flat and receive a JWT

### Bookings (Protected Routes)
*Requires `Authorization: Bearer <token>`*

- `POST /bookings` - Create a new booking
- `GET /bookings` - Retrieve all bookings for the logged-in user
- `GET /bookings?summary=true` - Retrieve booking summaries and total spending
- `GET /bookings?bookingId=<id>` - Retrieve a specific booking
- `PUT /bookings/:bookingId` - Update an existing booking
- `DELETE /bookings/:bookingId` - Cancel and delete a booking

---
*Built for CarLelo.io* 🚘
