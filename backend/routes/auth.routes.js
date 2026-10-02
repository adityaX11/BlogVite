import express from 'express';
import passport from 'passport';
import {
  signup,
  login,
  logout,
  refresh,
  getMe,
  updateProfile,
  oauthCallback,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

/* ─── Local JWT ──────────────────────────────────────────── */
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

/* ─── Google OAuth ───────────────────────────────────────── */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth` }),
  oauthCallback
);

/* ─── Facebook OAuth ─────────────────────────────────────── */
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'], session: false })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth` }),
  oauthCallback
);

export default router;
