import { User, Post } from '../../database/index.js';

/* ─── GET CURRENT USER PROFILE & STATS ───────────────────── */
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'name username email avatar bio')
      .populate('friendRequests.from', 'name username email avatar bio');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const postCount = await Post.countDocuments({ author: req.user._id });
    const userPosts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      user: user.toPublic(),
      friends: user.friends,
      friendRequests: user.friendRequests,
      postCount,
      posts: userPosts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── DISCOVER USERS (Search & Connect) ──────────────────── */
export const discoverUsers = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const query = { _id: { $ne: req.user._id } };

    if (search.trim()) {
      const term = search.trim();
      const orClauses = [
        { name: { $regex: term, $options: 'i' } },
        { username: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
      ];

      // If user typed an exact 24-character hexadecimal ObjectId
      if (/^[0-9a-fA-F]{24}$/.test(term)) {
        orClauses.push({ _id: term });
      }

      query.$or = orClauses;
    }

    const users = await User.find(query)
      .select('name username email avatar bio createdAt friends friendRequests')
      .limit(30)
      .lean();

    const currentUser = await User.findById(req.user._id);

    // Format with status relative to current user
    const formatted = users.map((u) => {
      const isFriend = currentUser.friends?.some(
        (f) => f.toString() === u._id.toString()
      );

      const hasSentRequest = u.friendRequests?.some(
        (r) => r.from?.toString() === req.user._id.toString() && r.status === 'pending'
      );

      const hasReceivedRequest = currentUser.friendRequests?.some(
        (r) => r.from?.toString() === u._id.toString() && r.status === 'pending'
      );

      let connectionStatus = 'none';
      if (isFriend) connectionStatus = 'connected';
      else if (hasSentRequest) connectionStatus = 'requested';
      else if (hasReceivedRequest) connectionStatus = 'pending_response';

      return {
        _id: u._id,
        name: u.name,
        username: u.username || '',
        email: u.email,
        avatar: u.avatar,
        bio: u.bio,
        createdAt: u.createdAt,
        connectionStatus,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── SEND FRIEND REQUEST ────────────────────────────────── */
export const sendFriendRequest = async (req, res) => {
  const { targetUserId } = req.params;
  try {
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    // Check if already friends
    if (targetUser.friends?.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already connected as friends' });
    }

    // Check if request already pending
    const alreadyRequested = targetUser.friendRequests?.some(
      (r) => r.from.toString() === req.user._id.toString() && r.status === 'pending'
    );
    if (alreadyRequested) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    targetUser.friendRequests.push({
      from: req.user._id,
      status: 'pending',
    });

    await targetUser.save({ validateBeforeSave: false });
    res.json({ message: 'Connection request sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── RESPOND TO FRIEND REQUEST (Accept / Reject) ────────── */
export const respondFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const { action } = req.body; // 'accept' or 'reject'

  try {
    const currentUser = await User.findById(req.user._id);
    const request = currentUser.friendRequests.id(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (action === 'accept') {
      const requesterId = request.from;

      // Add each other to friends array
      if (!currentUser.friends.includes(requesterId)) {
        currentUser.friends.push(requesterId);
      }

      const requester = await User.findById(requesterId);
      if (requester && !requester.friends.includes(currentUser._id)) {
        requester.friends.push(currentUser._id);
        await requester.save({ validateBeforeSave: false });
      }

      request.status = 'accepted';
      currentUser.friendRequests.pull(requestId); // remove resolved request
      await currentUser.save({ validateBeforeSave: false });

      return res.json({ message: 'Connection accepted!' });
    } else {
      currentUser.friendRequests.pull(requestId);
      await currentUser.save({ validateBeforeSave: false });
      return res.json({ message: 'Request declined' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── REMOVE FRIEND (Unfriend) ───────────────────────────── */
export const unfriend = async (req, res) => {
  const { friendId } = req.params;
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { friends: friendId },
    });
    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: req.user._id },
    });

    res.json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── GET ANOTHER USER'S PUBLIC PROFILE ─────────────────── */
export const getUserProfile = async (req, res) => {
  const { identifier } = req.params;
  try {
    let targetUser = null;

    if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
      targetUser = await User.findById(identifier);
    }
    if (!targetUser) {
      targetUser = await User.findOne({ username: identifier.toLowerCase().trim() });
    }

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ author: targetUser._id, status: 'active' })
      .sort({ createdAt: -1 })
      .populate('author', 'name username avatar')
      .lean();

    const currentUser = await User.findById(req.user._id);

    const isSelf = targetUser._id.toString() === req.user._id.toString();
    const isFriend = currentUser?.friends?.some(
      (f) => f.toString() === targetUser._id.toString()
    );
    const hasSentRequest = targetUser.friendRequests?.some(
      (r) => r.from?.toString() === req.user._id.toString() && r.status === 'pending'
    );
    const hasReceivedRequest = currentUser?.friendRequests?.some(
      (r) => r.from?.toString() === targetUser._id.toString() && r.status === 'pending'
    );

    let connectionStatus = 'none';
    if (isSelf) connectionStatus = 'self';
    else if (isFriend) connectionStatus = 'connected';
    else if (hasSentRequest) connectionStatus = 'requested';
    else if (hasReceivedRequest) connectionStatus = 'pending_response';

    res.json({
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        username: targetUser.username || '',
        avatar: targetUser.avatar || '',
        bio: targetUser.bio || '',
        createdAt: targetUser.createdAt,
        friendCount: targetUser.friends?.length || 0,
        postCount: posts.length,
      },
      connectionStatus,
      isSelf,
      posts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

