const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const buildAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

const buildRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};

const setRefreshCookie = (res, refreshToken) => {
  const maxAge = Number(process.env.REFRESH_COOKIE_MAX_AGE_MS) || 30 * 24 * 60 * 60 * 1000;
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge,
  });
};

const toAuthPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'An account already exists with this email',
      data: null,
    });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = buildAccessToken(user._id);
  const refreshToken = buildRefreshToken(user._id);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();
  setRefreshCookie(res, refreshToken);

  return res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: toAuthPayload(user),
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      data: null,
    });
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      data: null,
    });
  }

  const token = buildAccessToken(user._id);
  const refreshToken = buildRefreshToken(user._id);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();
  setRefreshCookie(res, refreshToken);

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: toAuthPayload(user),
      token,
    },
  });
};

const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Profile fetched successfully',
    data: req.user,
  });
};

const refresh = async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;

  if (!incomingToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token missing',
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+refreshTokenHash');

    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh session',
        data: null,
      });
    }

    const isTokenMatch = await bcrypt.compare(incomingToken, user.refreshTokenHash);
    if (!isTokenMatch) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token mismatch',
        data: null,
      });
    }

    const token = buildAccessToken(user._id);
    const nextRefreshToken = buildRefreshToken(user._id);
    user.refreshTokenHash = await bcrypt.hash(nextRefreshToken, 10);
    await user.save();
    setRefreshCookie(res, nextRefreshToken);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: toAuthPayload(user),
        token,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token expired or invalid',
      data: null,
    });
  }
};

const logout = async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;

  if (incomingToken) {
    try {
      const decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('+refreshTokenHash');
      if (user) {
        user.refreshTokenHash = null;
        await user.save();
      }
    } catch (error) {
      // Ignore token verification failures while logging out.
    }
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
};

module.exports = {
  register,
  login,
  getProfile,
  refresh,
  logout,
};
