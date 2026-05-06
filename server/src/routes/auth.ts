import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne } from '../db';
import { authMiddleware } from '../middleware/auth';
import { Admin } from '../types';

const router = Router();

// GET /api/auth/setup-status — returns whether any admin exists
router.get('/setup-status', async (_req: Request, res: Response): Promise<void> => {
  try {
    const existing = await queryOne<{ id: number }>('SELECT id FROM admins LIMIT 1');
    res.json({ needsSetup: !existing });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/auth/setup — create the first admin (only works if no admin exists)
router.post('/setup', async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await queryOne<{ id: number }>('SELECT id FROM admins LIMIT 1');
    if (existing) {
      res.status(403).json({ error: 'Admin already exists. Use login instead.' });
      return;
    }
    const { name, email, password } = req.body as { name: string; email: string; password: string };
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email and password are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }
    const hash = bcrypt.hashSync(password, 10);
    const admin = await queryOne<Admin>(
      'INSERT INTO admins (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email.toLowerCase().trim(), hash, name.trim()]
    );
    const token = jwt.sign(
      { id: admin!.id, email: admin!.email, name: admin!.name },
      process.env.JWT_SECRET ?? '',
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, admin: { id: admin!.id, email: admin!.email, name: admin!.name } });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }
    const admin = await queryOne<Admin>('SELECT * FROM admins WHERE email = $1', [email.toLowerCase().trim()]);
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET ?? '',
      { expiresIn: '7d' }
    );
    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/auth/create-admin  (admin only — add additional admins)
router.post('/create-admin', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string };
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email and password are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }
    const existing = await queryOne<{ id: number }>('SELECT id FROM admins WHERE email=$1', [email.toLowerCase().trim()]);
    if (existing) {
      res.status(409).json({ error: 'An admin with that email already exists' });
      return;
    }
    const hash = bcrypt.hashSync(password, 10);
    const admin = await queryOne<Admin>(
      'INSERT INTO admins (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email.toLowerCase().trim(), hash, name.trim()]
    );
    res.status(201).json({ message: 'Admin created', admin: { id: admin!.id, email: admin!.email, name: admin!.name } });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = await queryOne<Omit<Admin, 'password'>>(
      'SELECT id, email, name, created_at FROM admins WHERE id = $1',
      [req.admin!.id]
    );
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Both fields required' });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }
    const admin = await queryOne<Admin>('SELECT * FROM admins WHERE id = $1', [req.admin!.id]);
    if (!admin || !bcrypt.compareSync(currentPassword, admin.password)) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }
    const hash = bcrypt.hashSync(newPassword, 10);
    await query('UPDATE admins SET password = $1 WHERE id = $2', [hash, req.admin!.id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
