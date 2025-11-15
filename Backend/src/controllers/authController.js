import UserModel from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { generateToken } from '../utils/tokenUtils.js';
import { registerSchema, loginSchema } from '../utils/validation.js';

class AuthController {
  static async register(req, res, next) {
    try {
      const validatedData = await registerSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const { name, email, password } = validatedData;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists',
        });
      }

      const passwordHash = await hashPassword(password);

      const user = await UserModel.create({
        name,
        email,
        passwordHash,
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.created_at,
          },
          token,
        },
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: error.message || "Validation Error",
          errors: error.errors,
        });
      }
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const validatedData = await loginSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const { email, password } = validatedData;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isPasswordValid = await comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.created_at,
          },
          token,
        },
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;