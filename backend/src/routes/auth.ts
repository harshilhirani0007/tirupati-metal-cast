import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne } from '../db';
import { authMiddleware } from '../middleware/auth';
import { Admin } from '../types';

const router = Router();

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
