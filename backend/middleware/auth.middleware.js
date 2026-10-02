import jwt from 'jsonwebtoken';
import { User } from '../../../database/index.js';

/* ─── Protect middleware — verifies Bearer access token ───── */
export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized — no token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request (excluding sensitive fields)
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/* ─── Optional auth — attaches user if token present ─────── */
export const optionalAuth = async (req, _res, next) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    } catch {
      // ignore — user stays undefined
    }
  }
  next();
};

/* ─── Only allow the post author ─────────────────────────── */
export const isAuthor = (postAuthorId) => (req, res, next) => {
  if (req.user._id.toString() !== postAuthorId.toString()) {
    return res.status(403).json({ message: 'Forbidden — you are not the author' });
  }
  next();
};
