import { Router, Request, Response } from 'express';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';
import { Testimonial } from '../types';

const router = Router();

// GET /api/testimonials  (public)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query<Testimonial>("SELECT * FROM testimonials WHERE status='approved' ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/testimonials/all  (admin)
router.get('/all', authMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query<Testimonial>('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/testimonials  (admin)
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, company, text, rating, status } = req.body as Partial<Testimonial>;
    if (!name || !role || !company || !text) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const result = await query<{ id: number }>(
      'INSERT INTO testimonials (name, role, company, text, rating, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [name, role, company, text, rating ?? 5, status ?? 'pending']
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// PUT /api/testimonials/:id  (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, company, text, rating, status } = req.body as Partial<Testimonial>;
    await query(
      'UPDATE testimonials SET name=$1, role=$2, company=$3, text=$4, rating=$5, status=$6 WHERE id=$7',
      [name ?? '', role ?? '', company ?? '', text ?? '', rating ?? 5, status ?? 'pending', String(req.params.id)]
    );
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// DELETE /api/testimonials/:id  (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await query('DELETE FROM testimonials WHERE id=$1', [String(req.params.id)]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
