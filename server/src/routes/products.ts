import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';
import { Product } from '../types';

const router = Router();

// Multer storage — save to /uploads/products/
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), 'uploads', 'products');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

type ProductWithApps = Omit<Product, 'applications'> & { applications: string[] };

function parseProduct(p: Product): ProductWithApps {
  return { ...p, applications: p.applications ? p.applications.split(',') : [] };
}

function buildImageUrl(req: Request, filename: string): string {
  const base = process.env.RENDER_EXTERNAL_URL ?? `http://localhost:${process.env.PORT ?? 4000}`;
  return `${base}/uploads/products/${filename}`;
}

// POST /api/products/upload  (admin) — upload image, returns url
router.post('/upload', authMiddleware, upload.single('image'), (req: Request, res: Response): void => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  const url = buildImageUrl(req, req.file.filename);
  res.json({ url });
});

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
    const { category, description, grade, applications, color, active, sort_order, image_url } = req.body as Omit<Product, 'id' | 'created_at'> & { applications: string | string[] };
    if (!category || !description || !grade || !applications) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const appsStr = Array.isArray(applications) ? applications.join(',') : applications;
    const result = await query<{ id: number }>(
      'INSERT INTO products (category, description, grade, applications, color, active, sort_order, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [category, description, grade, appsStr, color ?? 'from-slate-700 to-slate-800', active ?? 1, sort_order ?? 0, image_url ?? '']
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// PUT /api/products/:id  (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, description, grade, applications, color, active, sort_order, image_url } = req.body as Omit<Product, 'id' | 'created_at'> & { applications: string | string[] };
    const appsStr = Array.isArray(applications) ? applications.join(',') : applications;
    await query(
      'UPDATE products SET category=$1, description=$2, grade=$3, applications=$4, color=$5, active=$6, sort_order=$7, image_url=$8 WHERE id=$9',
      [category, description, grade, appsStr, color, active ?? 1, sort_order ?? 0, image_url ?? '', String(req.params.id)]
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
