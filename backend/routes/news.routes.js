import express from 'express';
import { getNews } from '../controllers/news.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Only authenticated users can access news as requested in Requirement 2 & 7
router.get('/', protect, getNews);

export default router;
