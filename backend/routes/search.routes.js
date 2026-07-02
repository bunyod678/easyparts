const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Advanced search
router.get('/', async (req, res) => {
  try {
    const {
      query,
      category,
      condition,
      minPrice,
      maxPrice,
      brand,
      model,
      year,
      location,
      sort = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    let searchQuery = { status: 'active' };

    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { oemNumber: { $regex: query, $options: 'i' } },
        { partNumber: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) searchQuery.category = category;
    if (condition) searchQuery.condition = condition;
    if (brand) searchQuery.vehicleBrand = brand;
    if (model) searchQuery.vehicleModel = model;
    if (year) searchQuery.vehicleYear = parseInt(year);
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseInt(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseInt(maxPrice);
    }

    let sortQuery = {};
    switch (sort) {
      case 'price-low':
        sortQuery = { price: 1 };
        break;
      case 'price-high':
        sortQuery = { price: -1 };
        break;
      case 'popular':
        sortQuery = { views: -1 };
        break;
      case 'rating':
        sortQuery = { rating: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const products = await Product.find(searchQuery)
      .populate('seller', 'name profileImage')
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(searchQuery);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
