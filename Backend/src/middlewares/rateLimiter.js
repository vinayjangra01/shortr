import rateLimit from 'express-rate-limit';
import config from '../config/env.js';


export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes, So, the rate limit resets every 15 minutes.
  max: config.nodeEnv == 'development' ? 100 : 5, // 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});


export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});