import { Router, Request, Response } from 'express';
import { query, queryOne } from '../db';
import { authMiddleware } from '../middleware/auth';
import { Enquiry, EnquiryStats } from '../types';
import { sendReply } from '../mailer';

const router = Router();

// POST /api/enquiries  (public)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, company, email, phone, message } = req.body as Partial<Enquiry>;
    if (!name || !company || !email || !message) {
      res.status(400).json({ error: 'Name, company, email, and message are required' });
      return;
    }
    const result = await query<{ id: number }>(
      'INSERT INTO enquiries (name, company, email, phone, message) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [name, company, email, phone ?? '', message]
    );
    res.status(201).json({ id: result.rows[0].id, message: 'Enquiry submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/enquiries  (admin)
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const page = typeof req.query.page === 'string' ? req.query.page : '1';
    const limit = typeof req.query.limit === 'string' ? req.query.limit : '20';
    const offset = (Number(page) - 1) * Number(limit);

    const dataResult = status
      ? await query<Enquiry>('SELECT * FROM enquiries WHERE status=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [status, Number(limit), offset])
      : await query<Enquiry>('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT $1 OFFSET $2', [Number(limit), offset]);

    const countResult = status
      ? await query<{ total: string }>('SELECT COUNT(*) as total FROM enquiries WHERE status=$1', [status])
      : await query<{ total: string }>('SELECT COUNT(*) as total FROM enquiries');

    res.json({
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].total),
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/enquiries/stats  (admin)
router.get('/stats', authMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query<EnquiryStats & { total: string; new: string; read: string; replied: string }>(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status='new' THEN 1 ELSE 0 END) as "new",
        SUM(CASE WHEN status='read' THEN 1 ELSE 0 END) as "read",
        SUM(CASE WHEN status='replied' THEN 1 ELSE 0 END) as replied
      FROM enquiries
    `);
    const row = result.rows[0];
    res.json({
      total: parseInt(row.total),
      new: parseInt(String(row.new)),
      read: parseInt(String(row.read)),
      replied: parseInt(String(row.replied)),
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/enquiries/:id  (admin)
router.get('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const row = await queryOne<Enquiry>('SELECT * FROM enquiries WHERE id = $1', [String(req.params.id)]);
    if (!row) { res.status(404).json({ error: 'Not found' }); return; }
    if (row.status === 'new') {
      await query("UPDATE enquiries SET status='read' WHERE id=$1", [row.id]);
      row.status = 'read';
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// PUT /api/enquiries/:id/status  (admin)
router.put('/:id/status', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body as { status: string };
    const valid: Enquiry['status'][] = ['new', 'read', 'replied', 'archived'];
    if (!valid.includes(status as Enquiry['status'])) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }
    await query('UPDATE enquiries SET status=$1 WHERE id=$2', [status, String(req.params.id)]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/enquiries/:id/reply  (admin)
router.post('/:id/reply', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const enq = await queryOne<Enquiry>('SELECT * FROM enquiries WHERE id=$1', [String(req.params.id)]);
    if (!enq) { res.status(404).json({ error: 'Enquiry not found' }); return; }

    const { subject, body } = req.body as { subject: string; body: string };
    if (!subject?.trim() || !body?.trim()) {
      res.status(400).json({ error: 'Subject and body are required' });
      return;
    }

    await sendReply({ to: enq.email, toName: enq.name, subject, body, fromName: req.admin?.name ?? 'Admin' });
    await query("UPDATE enquiries SET status='replied' WHERE id=$1", [enq.id]);
    res.json({ message: 'Reply sent successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// DELETE /api/enquiries/:id  (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await query('DELETE FROM enquiries WHERE id=$1', [String(req.params.id)]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
