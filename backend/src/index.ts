import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import apiKeyRoutes from './routes/apiKeys';
import session from 'express-session';
import passport from './passport';
import subscriptionRoutes from './routes/subscription';
import errorHandler from './middleware/errorHandler';
import botsRoutes from './routes/bots';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Handle Stripe webhook raw body
app.use((req, res, next) => {
  if (req.originalUrl === '/api/subscription/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/bots', botsRoutes);

// Error Handling Middleware - Must be last
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || '', {})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 