require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { sequelize } = require('./models');

const authRoutes         = require('./routes/auth');
const userRoutes         = require('./routes/users');
const taskRoutes         = require('./routes/tasks');
const contentRoutes      = require('./routes/content');
const blogRoutes         = require('./routes/blogs');
const teamRoutes         = require('./routes/team');
const testimonialRoutes  = require('./routes/testimonials');
const serviceRoutes      = require('./routes/services');
const adminRoutes        = require('./routes/admin');

const app = express();

// Security & utility middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth',         authRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/tasks',        taskRoutes);
app.use('/api/content',      contentRoutes);
app.use('/api/blogs',        blogRoutes);
app.use('/api/team',         teamRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/services',     serviceRoutes);
app.use('/api/admin',        adminRoutes);

// Health check
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'Karyarambha API is running.', timestamp: new Date() })
);

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

module.exports = app;

// Start server only when not imported as module (e.g. tests)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  sequelize
    .sync({ alter: process.env.NODE_ENV === 'development' })
    .then(() => {
      console.log('Database synced.');
      app.listen(PORT, () => console.log(`Karyarambha API running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('DB connection error:', err.message);
      process.exit(1);
    });
}
