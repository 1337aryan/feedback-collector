const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');

// Helper: validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all feedback entries
// @route   GET /api/feedback
// @access  Public
const getAllFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single feedback by ID
// @route   GET /api/feedback/:id
// @access  Public
const getFeedbackById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid feedback ID: ${id}`,
      });
    }

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Public
const createFeedback = async (req, res, next) => {
  try {
    // Check express-validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, message } = req.body;

    const feedback = await Feedback.create({ name, email, message });

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete feedback by ID
// @route   DELETE /api/feedback/:id
// @access  Public
const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid feedback ID: ${id}`,
      });
    }

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats
// @access  Public
const getFeedbackStats = async (req, res, next) => {
  try {
    const now = new Date();

    // Start of today (midnight)
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // Start of this week (last Sunday midnight)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // go back to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const [total, today, thisWeek] = await Promise.all([
      Feedback.countDocuments(),
      Feedback.countDocuments({ createdAt: { $gte: startOfToday, $lte: now } }),
      Feedback.countDocuments({ createdAt: { $gte: startOfWeek, $lte: now } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        today,
        thisWeek,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  deleteFeedback,
  getFeedbackStats,
};
