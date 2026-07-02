const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { authenticate } = require('../middleware/auth');

// Send message
router.post('/', authenticate, async (req, res) => {
  try {
    const { recipientId, content, attachments, priceOffer } = req.body;

    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content,
      attachments: attachments || [],
      priceOffer: priceOffer || null
    });

    await message.save();
    await message.populate('sender recipient', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get conversation with user
router.get('/conversation/:userId', authenticate, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id }
      ]
    })
    .populate('sender recipient', 'name profileImage')
    .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { sender: req.params.userId, recipient: req.user.id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all conversations
router.get('/', authenticate, async (req, res) => {
  try {
    const conversations = await Message.find({
      $or: [
        { sender: req.user.id },
        { recipient: req.user.id }
      ]
    })
    .populate('sender recipient', 'name profileImage')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
