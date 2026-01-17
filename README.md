# Car Rental API

A RESTful car rental booking system built with **TypeScript**, **Express.js**, and **PostgreSQL**.

## Features

- **User Authentication** – Signup & login with JWT-based auth and bcrypt password hashing
- **Booking Management** – Create, view, and manage car rental bookings
- **PostgreSQL Database** – Persistent storage with auto-table creation on startup

## Tech Stack

- TypeScript | Express.js | PostgreSQL | JWT | bcrypt

## Prerequisites

- Node.js (v18+)
- PostgreSQL database
- npm

## Setup & Run

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd "CarRental in TS"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**  
   Create a `.env` file with:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/carrental
   PORT=3000
   JWT_SECRET=your_secret_key
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

## API Endpoints

| Route | Description |
|-------|-------------|
| `/auth` | User signup & login |
| `/bookings` | Manage car bookings (requires auth) |

## Project Structure

```
src/
├── index.ts        # Entry point
├── db.ts           # Database setup
├── routes/         # API routes
├── middlewares/    # Auth middleware
└── types/          # TypeScript types
```
