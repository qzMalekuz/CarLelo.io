import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "../db";

const router = Router();

const saltRounds = Number(process.env.SALT_ROUND) || 10;
const jwtSecret = process.env.JWT_SECRET as string;

router.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: "invalid inputs" });
  }

  const existingUser = await client.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (existingUser.rows.length > 0) {
    return res.status(409).json({ success: false, error: "username already exists" });
  }

  const hashed = await bcrypt.hash(password, saltRounds);

  const result = await client.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
    [username, hashed]
  );

  res.status(201).json({
    success: true,
    data: {
      message: "User created successfully",
      userId: result.rows[0].id,
    }
  });
});

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: "invalid inputs" });
  }

  const result = await client.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ success: false, error: "user does not exist" });
  }

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ success: false, error: "incorrect password" });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    jwtSecret,
    { expiresIn: "24h" }
  );

  res.json({
    success: true,
    data: {
      message: "Login successful",
      token
    }
  });
});

export default router;
