import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import jwt from 'jsonwebtoken';
import { User } from '../../../database/index.js';

/* ─── Shared OAuth user resolver ─────────────────────────── */
const resolveOAuthUser = async (profile, provider, done) => {
  try {
    // 1. Look for existing user with this OAuth provider + id
    let user = await User.findOne({ provider, providerId: profile.id });

    if (!user) {
      // 2. Maybe they signed up locally with same email — link accounts
      const email =
        profile.emails?.[0]?.value ||
        `${profile.id}@${provider}.noreply`;

      user = await User.findOne({ email });
      if (user && user.provider === 'local') {
        // Link OAuth to existing local account
        user.provider = provider;
        user.providerId = profile.id;
        user.avatar = user.avatar || profile.photos?.[0]?.value || '';
        await user.save({ validateBeforeSave: false });
      } else if (!user) {
        // 3. Brand new user — create
        user = await User.create({
          name: profile.displayName || profile.username || 'User',
          email,
          avatar: profile.photos?.[0]?.value || '',
          provider,
          providerId: profile.id,
        });
      }
    }

    // Generate tokens and attach to user object for controller
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

/* ─── Facebook Strategy ──────────────────────────────────── */
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

// Passport serialize/deserialize — not used (stateless JWT), but required by passport
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
