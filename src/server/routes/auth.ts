import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

let hashedPassword: string | null = null;

async function getHashedPassword(): Promise<string> {
  if (!hashedPassword) {
    hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  }
  return hashedPassword;
}

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ error: "Password required" });
    return;
  }

  const hash = await getHashedPassword();
  const valid = await bcrypt.compare(password, hash);

  if (!valid) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = jwt.sign({ sub: "admin" }, JWT_SECRET, { expiresIn: "30d" });
  res.json({ token });
});

export default router;
