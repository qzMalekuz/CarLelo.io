import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth";
import bookingRoutes from "./routes/bookings";
import { client, dbSetup } from "./db";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);

const port = Number(process.env.PORT) || 3000;

async function start() {
  await client.connect();
  await dbSetup();

  console.log("DB connected");

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start();