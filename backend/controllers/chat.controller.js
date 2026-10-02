import { Message, User } from '../../database/index.js';

/* ─── GET CONVERSATION WITH FRIEND ───────────────────────── */
export const getConversation = async (req, res) => {
  const { friendId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: friendId },
        { sender: friendId, recipient: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .lean();

    // Mark unread messages as read
    await Message.updateMany(
      { sender: friendId, recipient: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── SEND MESSAGE ───────────────────────────────────────── */
export const sendMessage = async (req, res) => {
  const { recipientId, text } = req.body;
  if (!recipientId || !text?.trim()) {
    return res.status(400).json({ message: 'Recipient and text are required' });
  }

  try {
    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      text: text.trim(),
    });

    await message.populate('sender', 'name avatar');
    await message.populate('recipient', 'name avatar');

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── GET RECENT CONVERSATIONS LIST ──────────────────────── */
export const getRecentConversations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'name email avatar bio');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const conversations = await Promise.all(
      user.friends.map(async (friend) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: req.user._id, recipient: friend._id },
            { sender: friend._id, recipient: req.user._id },
          ],
        })
          .sort({ createdAt: -1 })
          .lean();

        const unreadCount = await Message.countDocuments({
          sender: friend._id,
          recipient: req.user._id,
          read: false,
        });

        return {
          friend,
          lastMessage,
          unreadCount,
        };
      })
    );

    // Sort by last active message
    conversations.sort((a, b) => {
      const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
