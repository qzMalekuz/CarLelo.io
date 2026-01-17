import { Client } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

export const client = new Client({
  connectionString,
});


export async function dbSetup() {
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      car_name VARCHAR(255) NOT NULL,
      days INTEGER NOT NULL,
      rent_per_day INTEGER NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'booked',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );   
    `);
}