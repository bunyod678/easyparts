const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const { authenticate } = require('../middleware/auth');

// Get all shops
router.get('/', async (req, res) => {
  try {
    const shops = await Shop.find({ status: 'verified' })
      .select('-products')
      .sort({ rating: -1 });

    res.json({ success: true, data: shops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get shop details
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('products')
      .populate('reviews');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create shop
router.post('/', authenticate, async (req, res) => {
  try {
    const shopData = {
      owner: req.user.id,
      ...req.body
    };

    const shop = new Shop(shopData);
    await shop.save();

    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: shop
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update shop
router.put('/:id', authenticate, async (req, res) => {
  try {
    let shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({
      success: true,
      message: 'Shop updated',
      data: shop
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
