import { Router, Request, Response } from 'express';
import prisma from '../prisma.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { date, type, importance, search } = req.query;

  const where: Record<string, unknown> = {};

  if (date) where.date = date as string;
  if (importance) where.importance = importance as string;
  if (type) where.types = { has: type as string };
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { notes: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const activities = await prisma.activity.findMany({
    where,
    orderBy: [{ date: 'desc' }, { startTime: 'asc' }],
  });

  res.json(activities);
});

router.post('/', async (req: Request, res: Response) => {
  const { title, date, startTime, endTime, types, importance, notes } = req.body;

  if (!title || !date || !startTime || !importance) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const activity = await prisma.activity.create({
    data: { title, date, startTime, endTime: endTime || null, types: types || [], importance, notes: notes || '' },
  });

  res.status(201).json(activity);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, date, startTime, endTime, types, importance, notes } = req.body;

  const activity = await prisma.activity.update({
    where: { id },
    data: { title, date, startTime, endTime: endTime || null, types: types || [], importance, notes: notes || '' },
  });

  res.json(activity);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.activity.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
