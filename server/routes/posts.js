// posts.js - Posts API routes

const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation middleware
const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
];

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments({ isPublished: true });

    let query = Post.find({ isPublished: true })
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort('-createdAt');

    // Filter by category
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }

    // Search functionality
    if (req.query.search) {
      query = query.find({
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { content: { $regex: req.query.search, $options: 'i' } },
        ],
      });
    }

    const posts = await query.skip(startIndex).limit(limit);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .populate('comments.user', 'name');

    if (!post) {
      return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }

    // Increment view count
    await post.incrementViewCount();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, authorize('user', 'admin'), upload.single('featuredImage'), validatePost, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Add author to req.body
    req.body.author = req.user.id;

    // Handle image upload
    if (req.file) {
      req.body.featuredImage = req.file.filename;
    }

    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
router.put('/:id', protect, authorize('user', 'admin'), upload.single('featuredImage'), validatePost, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this post`, 401));
    }

    // Handle image upload
    if (req.file) {
      req.body.featuredImage = req.file.filename;
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, authorize('user', 'admin'), async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this post`, 401));
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
router.post('/:id/comments', protect, [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }

    await post.addComment(req.user.id, req.body.content);

    // Populate the updated post
    const updatedPost = await Post.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .populate('comments.user', 'name');

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 