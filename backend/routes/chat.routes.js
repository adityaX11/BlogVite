import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getConversation,
  sendMessage,
  getRecentConversations,
} from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/conversations', protect, getRecentConversations);
router.get('/:friendId', protect, getConversation);
router.post('/send', protect, sendMessage);

export default router;
