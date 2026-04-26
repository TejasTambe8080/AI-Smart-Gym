// Temporary User Storage (JSON file-based) - Remove after MongoDB is fixed
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
const dataDir = path.dirname(USERS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users file
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// Read all users from file
const getAllUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const normalizeEmail = (email) => email?.trim().toLowerCase();

// Save users to file
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Find user by email
const findUserByEmail = (email) => {
  const users = getAllUsers();
  const normalizedEmail = normalizeEmail(email);
  return users.find(u => u.email === normalizedEmail);
};

// Find user by ID
const findUserById = (id) => {
  const users = getAllUsers();
  return users.find(u => u._id === id);
};

// Create new user
const createUser = (userData) => {
  const users = getAllUsers();
  const normalizedEmail = normalizeEmail(userData.email);
  const newUser = {
    _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...userData,
    email: normalizedEmail,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Update user
const updateUser = (id, updates) => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u._id === id);
  if (userIndex === -1) return null;
  
  users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date() };
  saveUsers(users);
  return users[userIndex];
};

module.exports = {
  getAllUsers,
  saveUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
};
