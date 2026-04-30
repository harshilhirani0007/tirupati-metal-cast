import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth';
import enquiriesRouter from './routes/enquiries';
import productsRouter from './routes/products';
import testimonialsRouter from './routes/testimonials';
import settingsRouter from './routes/settings';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? [
      ...process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()),
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
    ]
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/settings', settingsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`[TMC Server] running on http://localhost:${PORT}`);

  // Prevent Render free tier from sleeping (ping every 14 minutes)
  if (process.env.RENDER_EXTERNAL_URL) {
    setInterval(() => {
      fetch(`${process.env.RENDER_EXTERNAL_URL}/api/health`)
        .catch(() => { /* ignore */ });
    }, 14 * 60 * 1000);
  }
});
