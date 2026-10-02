import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });
dotenv.config();

import passport from 'passport';
import connectDB from '../database/index.js';
import './config/passport.js';        // register strategies
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';

const app = express();

/* ─── Security ──────────────────────────────────────────── */
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

/* ─── Rate limiting ─────────────────────────────────────── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

/* ─── Parsers ────────────────────────────────────────────── */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(passport.initialize());

/* ─── Routes ─────────────────────────────────────────────── */
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'OK', timestamp: new Date() }));

/* ─── Global error handler ───────────────────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

/* ─── Start ──────────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
});
