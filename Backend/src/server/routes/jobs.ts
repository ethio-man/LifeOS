import { Router } from "express";
import type { Request, Response } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: Record<string, unknown> = {};
  if (status) where.status = status as string;

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  res.json(jobs);
});

router.post("/", async (req: Request, res: Response) => {
  const {
    company,
    role,
    status,
    appliedDate,
    location,
    url,
    rejection,
    notes,
  } = req.body;

  if (!company || !role || !status || !appliedDate) {
    res
      .status(400)
      .json({ error: "Company, role, status and applied date are required" });
    return;
  }

  const job = await prisma.job.create({
    data: {
      company,
      role,
      status,
      appliedDate,
      location: location || "",
      url: url || "",
      rejection: rejection || "",
      notes: notes || "",
    },
  });

  res.status(201).json(job);
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const {
    company,
    role,
    status,
    appliedDate,
    location,
    url,
    rejection,
    notes,
  } = req.body;

  const job = await prisma.job.update({
    where: { id },
    data: {
      company,
      role,
      status,
      appliedDate,
      location: location || "",
      url: url || "",
      rejection: rejection || "",
      notes: notes || "",
    },
  });

  res.json(job);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  await prisma.job.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
