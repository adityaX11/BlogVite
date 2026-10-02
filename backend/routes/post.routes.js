import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';
import { upload } from '../utils/cloudinary.js';
import {
  createPost,
  getPosts,
  getPost,
  getMyPosts,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';

const router = express.Router();

/* ─── Public ─────────────────────────────────────────────── */
router.get('/', optionalAuth, getPosts);
router.get('/my', protect, getMyPosts);
router.get('/:slug', optionalAuth, getPost);

/* ─── Protected ──────────────────────────────────────────── */
router.post('/', protect, upload.single('featuredImage'), createPost);
router.put('/:slug', protect, upload.single('featuredImage'), updatePost);
router.delete('/:slug', protect, deletePost);

export default router;
