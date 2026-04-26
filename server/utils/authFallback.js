/**
 * Authentication Fallback - In-Memory User Store for Development
 * Used when MongoDB is unavailable
 * Production deployments must use real MongoDB
 */

const bcrypt = require('bcryptjs');

// In-memory user store (persists during server runtime only)
let users = [];

/**
 * Fallback signup - store user in memory
 */
const fallbackSignup = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return { error: 'This email is already registered. Try logging in instead.', status: 400 };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create user object
    const user = {
      _id: `user_${Date.now()}_${Math.random()}`,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      age: userData.age || null,
      weight: userData.weight || null,
      height: userData.height || null,
      fitnessGoal: userData.fitnessGoal || 'general_fitness',
      role: 'user',
      createdAt: new Date(),
    };

    users.push(user);
    console.log(`✅ [FALLBACK AUTH] User registered: ${user.email} (${users.length} users in memory)`);

    // Return user without password
    const { password, ...userResponse } = user;
    return { success: true, user: userResponse };
  } catch (error) {
    return { error: error.message, status: 500 };
  }
};

/**
 * Fallback login - authenticate against in-memory store
 */
const fallbackLogin = async (email, password) => {
  try {
    const normalizedEmail = email?.trim().toLowerCase();

    // Find user
    let user = users.find(u => u.email === normalizedEmail);

    if (!user) {
      return { error: 'Email not found. Please sign up first.', status: 400 };
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Incorrect password. Please try again.', status: 400 };
    }

    console.log(`✅ [FALLBACK AUTH] User logged in: ${user.email}`);

    // Return user without password
    const { password: _, ...userResponse } = user;
    return { success: true, user: userResponse };
  } catch (error) {
    return { error: error.message, status: 500 };
  }
};

/**
 * Fallback get user - retrieve from memory by ID
 */
const fallbackGetUser = (userId) => {
  const user = users.find(u => u._id === userId);
  if (!user) {
    return null;
  }
  const { password, ...userResponse } = user;
  return userResponse;
};

/**
 * Fallback update user - update user in memory
 */
const fallbackUpdateUser = (userId, updateData) => {
  const userIndex = users.findIndex(u => u._id === userId);
  if (userIndex === -1) {
    return null;
  }

  const { password, email, _id, role, createdAt, ...updates } = updateData;
  users[userIndex] = { ...users[userIndex], ...updates };

  const { password: _, ...userResponse } = users[userIndex];
  return userResponse;
};

/**
 * Get current in-memory user count (for debugging)
 */
const getUserCount = () => users.length;

/**
 * Clear all users (for testing)
 */
const clearUsers = () => {
  users = [];
};

module.exports = {
  fallbackSignup,
  fallbackLogin,
  fallbackGetUser,
  fallbackUpdateUser,
  getUserCount,
  clearUsers,
};
