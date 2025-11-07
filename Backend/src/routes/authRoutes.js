import express from 'express'
import AuthController from '../controllers/authController.js'
import {authenticateToken} from '../middlewares/authMiddleware.js';
import {authLimiter} from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post("/register", authLimiter, AuthController.register);

router.post("/login", authLimiter, AuthController.login);

router.get("/me", authenticateToken, AuthController.getProfile);


export default router;