const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, quantity, shippingAddress, paymentMethod } = req.body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const orderNumber = 'ORD-' + Date.now();
    const totalAmount = product.price * quantity;

    const order = new Order({
      orderNumber,
      buyer: req.user.id,
      seller: product.seller,
      product: productId,
      quantity,
      price: product.price,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });

    await order.save();
    await order.populate('product buyer seller');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('product')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product')
      .populate('buyer')
      .populate('seller');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
