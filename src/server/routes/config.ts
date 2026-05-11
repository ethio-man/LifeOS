import { Router } from "express";
import type { Request, Response } from "express";
import prisma from "../prisma.js";

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

router.get("/", async (_req: Request, res: Response) => {
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
});

router.put("/", async (req: Request, res: Response) => {
  const { activityTypes, importanceLevels } = req.body;

  const config = await prisma.config.upsert({
    where: { id: "default" },
    update: { activityTypes, importanceLevels },
    create: {
      id: "default",
      activityTypes: activityTypes || DEFAULT_TYPES,
      importanceLevels: importanceLevels || DEFAULT_LEVELS,
    },
  });

  res.json(config);
});

export default router;
