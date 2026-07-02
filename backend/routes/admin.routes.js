const express = require('express');
const router = express.Router();
const { authenticate, admin } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Shop = require('../models/Shop');

// Get dashboard stats
router.get('/stats', authenticate, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalShops = await Shop.countDocuments();
    const totalListings = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalShops,
        totalListings,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manage users
router.put('/users/:id', authenticate, admin, async (req, res) => {
  try {
    const { action } = req.body;

    if (action === 'delete') {
      await User.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'User deleted' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: action, updatedAt: new Date() },
      { new: true }
    );

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manage listings
router.put('/listings/:id', authenticate, admin, async (req, res) => {
  try {
    const { action } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: action, updatedAt: new Date() },
      { new: true }
    );

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all pending listings
router.get('/listings/pending', authenticate, admin, async (req, res) => {
  try {
    const products = await Product.find({ status: 'pending' })
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
