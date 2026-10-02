import jwt from 'jsonwebtoken';
import { User } from '../../database/index.js';

/* ─── Token factory ──────────────────────────────────────── */
const generateTokens = (userId) => ({
  accessToken: jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  }),
  refreshToken: jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  }),
});

/* ─── Cookie options ─────────────────────────────────────── */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days
};

/* ════════════════════════════════════════════════════════════
   SIGNUP
════════════════════════════════════════════════════════════ */
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, provider: 'local' });
    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.status(201).json({ accessToken, user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════════════════════════
   LOGIN
════════════════════════════════════════════════════════════ */
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  try {
    // Explicitly select password (it's excluded by default via schema)
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.json({ accessToken, user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════════════════════════
   REFRESH TOKEN
════════════════════════════════════════════════════════════ */
export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Refresh token invalid or reused' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.json({ accessToken });
  } catch {
    res.clearCookie('refreshToken');
    res.status(403).json({ message: 'Refresh token expired — please log in again' });
  }
};

/* ════════════════════════════════════════════════════════════
   LOGOUT
════════════════════════════════════════════════════════════ */
export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      const user = await User.findOne({ refreshToken: token }).select('+refreshToken');
      if (user) {
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });
      }
    } catch { /* silently continue */ }
  }
  res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });
  res.json({ message: 'Logged out successfully' });
};

/* ════════════════════════════════════════════════════════════
   GET CURRENT USER
════════════════════════════════════════════════════════════ */
export const getMe = async (req, res) => {
  res.json({ user: req.user.toPublic() });
};

/* ════════════════════════════════════════════════════════════
   UPDATE PROFILE
════════════════════════════════════════════════════════════ */
export const updateProfile = async (req, res) => {
  const { name, bio } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    await user.save();
    res.json({ user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════════════════════════
   OAUTH CALLBACK HANDLER (shared by Google + Facebook)
   Called after Passport strategy succeeds.
════════════════════════════════════════════════════════════ */
export const oauthCallback = (req, res) => {
  const { accessToken, refreshToken } = req.user;
  res.cookie('refreshToken', refreshToken, cookieOptions);
  // Redirect frontend with short-lived access token in query
  res.redirect(
    `${process.env.FRONTEND_URL}/oauth-callback?token=${accessToken}`
  );
};
