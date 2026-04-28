import { Router, Request, Response } from 'express';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';
import { Setting } from '../types';

const router = Router();

// GET /api/settings  (public)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query<Setting>('SELECT key, value FROM settings');
    const obj = Object.fromEntries(result.rows.map(r => [r.key, r.value]));
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// PUT /api/settings  (admin — bulk update)
router.put('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const updates = req.body as Record<string, string>;
    for (const [key, value] of Object.entries(updates)) {
      await query(
        'INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()',
        [key, String(value)]
      );
    }
    res.json({ message: 'Settings saved' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
