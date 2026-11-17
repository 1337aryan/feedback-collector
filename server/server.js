require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const feedbackRoutes = require('./routes/feedbackRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Feedback Collector API is running' });
});

// API routes
app.use('/api/feedback', feedbackRoutes);

// 404 handler for unmatched routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

// Connect to MongoDB then start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('===========================================');
      console.log(`  Feedback Collector API`);
      console.log(`  Server running on port ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  URL: http://localhost:${PORT}`);
      console.log('===========================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
