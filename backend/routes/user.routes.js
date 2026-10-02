import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getMyProfile,
  discoverUsers,
  sendFriendRequest,
  respondFriendRequest,
  unfriend,
  getUserProfile,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile', protect, getMyProfile);
router.get('/profile/:identifier', protect, getUserProfile);
router.get('/discover', protect, discoverUsers);
router.post('/connect/:targetUserId', protect, sendFriendRequest);
router.put('/request/:requestId', protect, respondFriendRequest);
router.delete('/unfriend/:friendId', protect, unfriend);

export default router;
