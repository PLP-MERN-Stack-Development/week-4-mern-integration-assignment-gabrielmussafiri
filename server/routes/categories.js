// categories.js - Categories API routes

const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');

const router = express.Router();

// Validation middleware
const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category name must be between 1 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot be more than 200 characters'),
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Users and Admin)
router.post('/', protect, authorize('user', 'admin'), validateCategory, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), validateCategory, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 