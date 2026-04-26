// Authentication Controller - Handles signup and login
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const { findUserByEmail, createUser, findUserById, updateUser } = require('../services/userService');
const { findTrainerByEmail, findTrainerById } = require('../services/trainerService');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, age, weight, height, fitnessGoal } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const useFallbackStore = mongoose.connection.readyState !== 1;

    // Validation
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ 
        message: 'Please fill in all the required fields' 
      });
    }

    // Check if user already exists
    const existingUser = useFallbackStore
      ? findUserByEmail(normalizedEmail)
      : await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered. Try logging in instead.' });
    }

    if (useFallbackStore) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = createUser({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        age,
        weight,
        height,
        fitnessGoal,
      });

      const token = generateToken(createdUser._id);
      const userResponse = { ...createdUser };
      delete userResponse.password;

      console.log(`✅ [AUTH-FALLBACK] User signed up: ${normalizedEmail}`);
      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: userResponse,
        success: true,
      });
    }

    // Create new user (password hashing is handled by User model pre-save hook)
    const user = new User({
      name,
      email: normalizedEmail,
      password,
      age,
      weight,
      height,
      fitnessGoal,
    });
    
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log(`✅ [AUTH] User signed up: ${email}`);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse,
      success: true,
    });
  } catch (error) {
    console.error('❌ Signup error:', error.message);
    res.status(500).json({ 
      message: 'Server error during signup', 
      error: error.message,
      success: false 
    });
  }
};

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const useFallbackStore = mongoose.connection.readyState !== 1;

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Please enter your email and password' });
    }

    // Check if user exists as User
    let user = useFallbackStore
      ? findUserByEmail(normalizedEmail)
      : await User.findOne({ email: normalizedEmail }).select('+password');
    let isTrainer = false;

    // If not User, check if Trainer
    if (!user) {
      user = useFallbackStore
        ? findTrainerByEmail(normalizedEmail)
        : await Trainer.findOne({ email: normalizedEmail }).select('+password');
      isTrainer = Boolean(user);
    }

    if (!user) {
      return res.status(400).json({ message: 'Email not found. Please sign up first.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }

    const token = generateToken(user._id);

    const userResponse = typeof user.toObject === 'function' ? user.toObject() : { ...user };
    delete userResponse.password;

    console.log(`✅ [AUTH] ${isTrainer ? 'Trainer' : 'User'} logged in: ${email}`);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: userResponse,
      success: true,
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: error.message,
      success: false 
    });
  }
};

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const useFallbackStore = mongoose.connection.readyState !== 1;
    let user = useFallbackStore ? findUserById(req.userId) : await User.findById(req.userId).select('-password');
    if (!user) {
      user = useFallbackStore ? findTrainerById(req.userId) : await Trainer.findById(req.userId).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('❌ Get profile error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/auth/update
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, age, weight, height, fitnessGoal } = req.body;
    const useFallbackStore = mongoose.connection.readyState !== 1;
    
    // Determine if User or Trainer (For simplicity, just try updating User first)
    let user = useFallbackStore
      ? updateUser(req.userId, { name, age, weight, height, fitnessGoal })
      : await User.findByIdAndUpdate(req.userId, {
          name, age, weight, height, fitnessGoal
        }, { new: true }).select('-password');

    if (!user) {
      user = useFallbackStore ? null : await Trainer.findByIdAndUpdate(req.userId, req.body, { new: true }).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`✅ [AUTH] Profile updated: ${user.email}`);
    res.status(200).json({ 
      success: true,
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('❌ Update profile error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
