const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// Get current user
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, phone, location, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, location, profileImage, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated', data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user favorites
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json({ success: true, data: user.favorites || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to favorites
router.post('/favorites/:productId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(req.params.productId)) {
      user.favorites.push(req.params.productId);
      await user.save();
    }
    res.json({ success: true, message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from favorites
router.delete('/favorites/:productId', authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: req.params.productId } },
      { new: true }
    );
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
