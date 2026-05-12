import { Router } from "express";
import type { Request, Response } from "express";
import prisma from "../prisma.js";
import { authMiddleware } from "../middleware/auth.js";

const DEFAULT_TYPES = [
  "Coding",
  "Entertainment",
  "Sleep",
  "Nap",
  "Exploring",
  "Studying-docs",
  "Internship-office",
  "System-designing",
  "Important-discussion",
  "Fun-conversation",
  "Time-wasting-conversation",
  "Studying-academics",
  "Attending-class",
  "Doing-assignment",
];

const DEFAULT_LEVELS = [
  "Goal oriented",
  "Important",
  "Medium",
  "Less",
  "Waste",
];

const router = Router();

router.get("/", async (_req: Request, res: Response, next) => {
  try {
    let config = await prisma.config.findUnique({ where: { id: "default" } });

    if (!config) {
      config = await prisma.config.create({
        data: {
          id: "default",
          activityTypes: DEFAULT_TYPES,
          importanceLevels: DEFAULT_LEVELS,
        },
      });
    }

    res.json(config);
  } catch (err) {
    console.error("[config GET]", err);
    next(err);
  }
});

router.put("/", authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { activityTypes, importanceLevels } = req.body;

    const config = await prisma.config.upsert({
      where: { id: "default" },
      update: {
        ...(activityTypes !== undefined && { activityTypes }),
        ...(importanceLevels !== undefined && { importanceLevels }),
      },
      create: {
        id: "default",
        activityTypes: activityTypes ?? DEFAULT_TYPES,
        importanceLevels: importanceLevels ?? DEFAULT_LEVELS,
      },
    });

    res.json(config);
  } catch (err) {
    console.error("[config PUT]", err);
    next(err);
  }
});

export default router;
