import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/sendEmail.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nmc_export_jwt_secret_key_2026';

export const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required.');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Incorrect email or password.');
  }

  const token = signToken(user);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// GET /api/auth/me (dynamically reads latest record from MongoDB)
export const getMe = asyncHandler(async (req, res) => {
  const freshUser = await User.findById(req.user._id);
  if (!freshUser) {
    res.status(401);
    throw new Error('User record not found in MongoDB.');
  }
  res.json({
    user: {
      id: freshUser._id,
      name: freshUser.name,
      email: freshUser.email,
      role: freshUser.role,
      updatedAt: freshUser.updatedAt,
    },
  });
});

// GET /api/auth/refresh (issues a fresh JWT with the latest MongoDB data)
export const refreshToken = asyncHandler(async (req, res) => {
  const freshUser = await User.findById(req.user._id);
  if (!freshUser) {
    res.status(401);
    throw new Error('User record no longer exists.');
  }
  const token = signToken(freshUser);
  res.json({
    token,
    user: {
      id: freshUser._id,
      name: freshUser.name,
      email: freshUser.email,
      role: freshUser.role,
    },
  });
});
