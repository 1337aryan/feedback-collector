const express = require('express');
const { body } = require('express-validator');
const {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  deleteFeedback,
  getFeedbackStats,
} = require('../controllers/feedbackController');

const router = express.Router();

// Validation middleware for POST /
const feedbackValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
];

// IMPORTANT: /stats MUST come before /:id to prevent 'stats' being treated as an ObjectId
router.get('/stats', getFeedbackStats);

router.route('/')
  .get(getAllFeedback)
  .post(feedbackValidation, createFeedback);

router.route('/:id')
  .get(getFeedbackById)
  .delete(deleteFeedback);

module.exports = router;
