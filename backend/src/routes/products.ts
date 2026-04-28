import { Router, Request, Response } from 'express';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';
import { Product } from '../types';

const router = Router();

type ProductWithApps = Omit<Product, 'applications'> & { applications: string[] };

function parseProduct(p: Product): ProductWithApps {
  return { ...p, applications: p.applications.split(',') };
}

// GET /api/products  (public)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query<Product>('SELECT * FROM products WHERE active=1 ORDER BY sort_order ASC');
    res.json(result.rows.map(parseProduct));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/products/all  (admin)
router.get('/all', authMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query<Product>('SELECT * FROM products ORDER BY sort_order ASC');
    res.json(result.rows.map(parseProduct));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/products  (admin)
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, description, grade, applications, color, active, sort_order } = req.body as Omit<Product, 'id' | 'created_at'> & { applications: string | string[] };
    if (!category || !description || !grade || !applications) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const appsStr = Array.isArray(applications) ? applications.join(',') : applications;
    const result = await query<{ id: number }>(
      'INSERT INTO products (category, description, grade, applications, color, active, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [category, description, grade, appsStr, color ?? 'from-slate-700 to-slate-800', active ?? 1, sort_order ?? 0]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// PUT /api/products/:id  (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, description, grade, applications, color, active, sort_order } = req.body as Omit<Product, 'id' | 'created_at'> & { applications: string | string[] };
    const appsStr = Array.isArray(applications) ? applications.join(',') : applications;
    await query(
      'UPDATE products SET category=$1, description=$2, grade=$3, applications=$4, color=$5, active=$6, sort_order=$7 WHERE id=$8',
      [category, description, grade, appsStr, color, active ?? 1, sort_order ?? 0, String(req.params.id)]
    );
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// DELETE /api/products/:id  (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await query('DELETE FROM products WHERE id=$1', [String(req.params.id)]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
