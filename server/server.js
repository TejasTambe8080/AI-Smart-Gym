// Main Express Server Configuration
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const statsRoutes = require('./routes/statsRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const weeklyPlanRoutes = require('./routes/weeklyPlanRoutes');
const progressionRoutes = require('./routes/progressionRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

app.use('/api/', limiter);


// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - allow both port 3000 and 3001 for development
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3000/',
      'http://localhost:3001/',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
// Log all requests in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
  }
  next();
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/weekly-plan', weeklyPlanRoutes);
app.use('/api/progression', progressionRoutes);
app.use('/api/trainers', trainerRoutes);


// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler - MUST be before error handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware - MUST be last
app.use(errorHandler);

const http = require('http');
const { initSocket } = require('./utils/socket');

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
});
