import { Router, Request, Response } from 'express';
import multer from 'multer';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';
import { Product } from '../types';
import cloudinary from '../cloudinary';

const router = Router();

// Multer memory storage — buffer sent directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

type ProductWithApps = Omit<Product, 'applications'> & { applications: string[] };

function parseProduct(p: Product): ProductWithApps {
  return { ...p, applications: p.applications ? p.applications.split(',') : [] };
}

// POST /api/products/upload  (admin) — upload to Cloudinary, return secure url
router.post('/upload', authMiddleware, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'tmc-products', resource_type: 'image' },
        (err, result) => {
          if (err || !result) reject(err ?? new Error('Upload failed'));
          else resolve(result);
        }
      );
      stream.end(req.file!.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
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
