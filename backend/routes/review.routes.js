const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authenticate } = require('../middleware/auth');

// Create review
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, sellerId, rating, comment, photos } = req.body;

    const review = new Review({
      product: productId,
      seller: sellerId,
      author: req.user.id,
      rating,
      comment,
      photos: photos || []
    });

    await review.save();
    await review.populate('author', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Review created',
      data: review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product reviews
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, status: 'approved' })
      .populate('author', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller reviews
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId, status: 'approved' })
      .populate('author', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
