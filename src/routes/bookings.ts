import { Router, Request, Response } from "express";
import { client } from "../db";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { carName, days, rentPerDay } = req.body;
  const userId = req.user.userId;

  if (!carName || !days || !rentPerDay) {
    return res.status(400).json({ success: false, error: "invalid inputs" });
  }

  if (days >= 365 || rentPerDay > 2000) {
    return res.status(400).json({ success: false, error: "invalid inputs" });
  }

  const result = await client.query(
    `INSERT INTO bookings (user_id, car_name, days, rent_per_day, status)
     VALUES ($1, $2, $3, $4, 'booked') RETURNING id`,
    [userId, carName, days, rentPerDay]
  );

  res.status(201).json({
    success: true,
    data: {
      message: "Booking created successfully",
      bookingId: result.rows[0].id,
      totalCost: days * rentPerDay,
    }
  });
});

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { summary, bookingId } = req.query;

  if (bookingId) {
    const result = await client.query(
      `SELECT * FROM bookings WHERE id = $1 AND user_id = $2`,
      [bookingId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "bookingId not found" });
    }

    const b = result.rows[0];
    return res.json({
      success: true,
      data: [{
        id: b.id,
        car_name: b.car_name,
        days: b.days,
        rent_per_day: b.rent_per_day,
        status: b.status,
        totalCost: b.days * b.rent_per_day
      }]
    });
  }

  if (summary === "true") {
    const result = await client.query(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(days * rent_per_day), 0) AS amount
       FROM bookings
       WHERE user_id = $1 AND status IN ('booked', 'completed')`,
      [userId]
    );

    return res.json({
      success: true,
      data: {
        userId: userId,
        username: req.user.username,
        totalBookings: parseInt(result.rows[0].total, 10),
        totalAmountSpent: parseInt(result.rows[0].amount, 10)
      }
    });
  }

  const result = await client.query(
    `SELECT * FROM bookings WHERE user_id = $1`,
    [userId]
  );

  const parsedBookings = result.rows.map(b => ({
    id: b.id,
    car_name: b.car_name,
    days: b.days,
    rent_per_day: b.rent_per_day,
    status: b.status,
    totalCost: b.days * b.rent_per_day
  }));

  return res.json({
    success: true,
    data: parsedBookings
  });
});

router.put("/:bookingId", authMiddleware, async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.userId;
  const { carName, days, rentPerDay, status } = req.body;

  const existingBooking = await client.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (existingBooking.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: "booking not found"
    });
  }

  const booking = existingBooking.rows[0];
  if (booking.user_id !== userId) {
    return res.status(403).json({
      success: false,
      error: "booking does not belong to user"
    });
  }

  if ((days && days >= 365) || (rentPerDay && rentPerDay > 2000)) {
    return res.status(400).json({
      success: false,
      error: "invalid inputs"
    });
  }

  if (carName || days || rentPerDay) {
    const newCarName = carName || booking.car_name;
    const newDays = days || booking.days;
    const newRentPerDay = rentPerDay || booking.rent_per_day;

    await client.query(
      'UPDATE bookings SET car_name = $1, days = $2, rent_per_day = $3 WHERE id = $4',
      [newCarName, newDays, newRentPerDay, bookingId]
    );
  }

  if (status) {
    await client.query(
      `UPDATE bookings SET status = $1 WHERE id = $2`,
      [status, bookingId]
    );
  }

  const updated = await client.query(
    'SELECT * FROM bookings WHERE id = $1',
    [bookingId]
  );

  const updatedBooking = updated.rows[0];

  return res.status(200).json({
    success: true,
    data: {
      message: "Booking updated successfully",
      booking: {
        id: updatedBooking.id,
        car_name: updatedBooking.car_name,
        days: updatedBooking.days,
        rent_per_day: updatedBooking.rent_per_day,
        status: updatedBooking.status,
        totalCost: updatedBooking.days * updatedBooking.rent_per_day
      }
    }
  });
});

router.delete("/:bookingId", authMiddleware, async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const userId = req.user.userId;

  const booking = await client.query(
    "SELECT * FROM bookings WHERE id = $1",
    [bookingId]
  );

  if (booking.rows.length === 0) {
    return res.status(404).json({ success: false, error: "booking not found" });
  }

  if (booking.rows[0].user_id !== userId) {
    return res.status(403).json({ success: false, error: "booking does not belong to user" });
  }

  await client.query("DELETE FROM bookings WHERE id = $1", [bookingId]);

  res.json({
    success: true,
    data: {
      message: "Booking deleted successfully"
    }
  });
});

export default router;