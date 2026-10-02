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
import { isGoogleConfigured, isFacebookConfigured } from '../config/passport.js';

const router = express.Router();

/* ─── Local JWT ──────────────────────────────────────────── */
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

/* ─── Google OAuth ───────────────────────────────────────── */
router.get('/google', (req, res, next) => {
  if (!isGoogleConfigured) {
    return res.status(503).json({ message: 'Google OAuth is not configured yet in backend/.env' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get(
  '/google/callback',
  (req, res, next) => {
    if (!isGoogleConfigured) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_not_configured`);
    }
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth`,
    })(req, res, next);
  },
  oauthCallback
);

/* ─── Facebook OAuth ─────────────────────────────────────── */
router.get('/facebook', (req, res, next) => {
  if (!isFacebookConfigured) {
    return res.status(503).json({ message: 'Facebook OAuth is not configured yet in backend/.env' });
  }
  passport.authenticate('facebook', { scope: ['email'], session: false })(req, res, next);
});

router.get(
  '/facebook/callback',
  (req, res, next) => {
    if (!isFacebookConfigured) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=facebook_not_configured`);
    }
    passport.authenticate('facebook', {
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth`,
    })(req, res, next);
  },
  oauthCallback
);

export default router;
