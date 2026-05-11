import { Router, Request, Response } from 'express';
import prisma from '../prisma.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: Record<string, unknown> = {};
  if (status) where.status = status as string;

  const projects = await prisma.project.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(projects);
});

router.post('/', async (req: Request, res: Response) => {
  const { name, status, desc, startDate, endDate, skills, url, progress, notes } = req.body;

  if (!name || !status) {
    res.status(400).json({ error: 'Name and status are required' });
    return;
  }

  const project = await prisma.project.create({
    data: {
      name, status, desc: desc || '', startDate: startDate || null,
      endDate: endDate || null, skills: skills || [], url: url || '',
      progress: progress || 0, notes: notes || '',
    },
  });

  res.status(201).json(project);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status, desc, startDate, endDate, skills, url, progress, notes } = req.body;

  const project = await prisma.project.update({
    where: { id },
    data: {
      name, status, desc: desc || '', startDate: startDate || null,
      endDate: endDate || null, skills: skills || [], url: url || '',
      progress: progress || 0, notes: notes || '',
    },
  });

  res.json(project);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
