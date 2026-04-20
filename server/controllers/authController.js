// Authentication Controller - Handles signup and login
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/userService');

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

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide name, email, and password' 
      });
    }

    // Check if user already exists
    const existingUser = userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = userService.createUser({
      name,
      email,
      password: hashedPassword,
      age,
      weight,
      height,
      fitnessGoal,
    });

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = { ...user };
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

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Check if user exists
    const user = userService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = { ...user };
    delete userResponse.password;

    console.log(`✅ [AUTH] User logged in: ${email}`);
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
    const user = userService.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userResponse = { ...user };
    delete userResponse.password;
    res.status(200).json({ success: true, user: userResponse });
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
    
    const user = userService.updateUser(req.userId, {
      name,
      age,
      weight,
      height,
      fitnessGoal,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResponse = { ...user };
    delete userResponse.password;

    console.log(`✅ [AUTH] Profile updated: ${user.email}`);
    res.status(200).json({ 
      success: true,
      message: 'Profile updated successfully',
      user: userResponse 
    });
  } catch (error) {
    console.error('❌ Update profile error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
