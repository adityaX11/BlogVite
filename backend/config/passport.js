import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { User } from '../../database/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config();

/* ─── Shared OAuth user resolver ─────────────────────────── */
const resolveOAuthUser = async (profile, provider, done) => {
  try {
    let user = await User.findOne({ provider, providerId: profile.id });

    if (!user) {
      const email =
        profile.emails?.[0]?.value ||
        `${profile.id}@${provider}.noreply`;

      user = await User.findOne({ email });
      if (user && user.provider === 'local') {
        user.provider = provider;
        user.providerId = profile.id;
        user.avatar = user.avatar || profile.photos?.[0]?.value || '';
        await user.save({ validateBeforeSave: false });
      } else if (!user) {
        user = await User.create({
          name: profile.displayName || profile.username || 'User',
          email,
          avatar: profile.photos?.[0]?.value || '',
          provider,
          providerId: profile.id,
        });
      }
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    done(null, { ...user.toPublic(), accessToken, refreshToken });
  } catch (err) {
    done(err, null);
  }
};

/* ─── Google Strategy ────────────────────────────────────── */
export const isGoogleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  !process.env.GOOGLE_CLIENT_ID.includes('xxxx') &&
  process.env.GOOGLE_CLIENT_SECRET &&
  !process.env.GOOGLE_CLIENT_SECRET.includes('xxxx')
);

if (isGoogleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
        scope: ['profile', 'email'],
      },
      (_accessToken, _refreshToken, profile, done) =>
        resolveOAuthUser(profile, 'google', done)
    )
  );
  console.log('✅  Google OAuth configured');
} else {
  console.log('ℹ️   Google OAuth not configured yet (awaiting credentials in .env)');
}

/* ─── Facebook Strategy ──────────────────────────────────── */
export const isFacebookConfigured = Boolean(
  process.env.FACEBOOK_APP_ID &&
  !process.env.FACEBOOK_APP_ID.includes('xxxx') &&
  process.env.FACEBOOK_APP_SECRET &&
  !process.env.FACEBOOK_APP_SECRET.includes('xxxx')
);

if (isFacebookConfigured) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'photos', 'email'],
      },
      (_accessToken, _refreshToken, profile, done) =>
        resolveOAuthUser(profile, 'facebook', done)
    )
  );
  console.log('✅  Facebook OAuth configured');
} else {
  console.log('ℹ️   Facebook OAuth not configured yet (awaiting credentials in .env)');
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
