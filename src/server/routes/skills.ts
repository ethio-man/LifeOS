import { Router, Request, Response } from 'express';
import prisma from '../prisma.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: Record<string, unknown> = {};
  if (status) where.status = status as string;

  const skills = await prisma.skill.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(skills);
});

router.post('/', async (req: Request, res: Response) => {
  const { name, status, category, level, tags, source, notes } = req.body;

  if (!name || !status) {
    res.status(400).json({ error: 'Name and status are required' });
    return;
  }

  const skill = await prisma.skill.create({
    data: { name, status, category: category || '', level: level || '', tags: tags || [], source: source || '', notes: notes || '' },
  });

  res.status(201).json(skill);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status, category, level, tags, source, notes } = req.body;

  const skill = await prisma.skill.update({
    where: { id },
    data: { name, status, category: category || '', level: level || '', tags: tags || [], source: source || '', notes: notes || '' },
  });

  res.json(skill);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await prisma.skill.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
