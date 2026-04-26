// Temporary Trainer Storage (JSON file-based) - Remove after MongoDB is fixed
const fs = require('fs');
const path = require('path');

const TRAINERS_FILE = path.join(__dirname, '../data/trainers.json');

const dataDir = path.dirname(TRAINERS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(TRAINERS_FILE)) {
  fs.writeFileSync(TRAINERS_FILE, JSON.stringify([], null, 2));
}

const getAllTrainers = () => {
  try {
    const data = fs.readFileSync(TRAINERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveTrainers = (trainers) => {
  fs.writeFileSync(TRAINERS_FILE, JSON.stringify(trainers, null, 2));
};

const normalizeEmail = (email) => email?.trim().toLowerCase();

const findTrainerByEmail = (email) => {
  const trainers = getAllTrainers();
  const normalizedEmail = normalizeEmail(email);
  return trainers.find((trainer) => trainer.email === normalizedEmail);
};

const findTrainerById = (id) => {
  const trainers = getAllTrainers();
  return trainers.find((trainer) => trainer._id === id);
};

const createTrainer = (trainerData) => {
  const trainers = getAllTrainers();
  const normalizedEmail = normalizeEmail(trainerData.email);
  const newTrainer = {
    _id: `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...trainerData,
    email: normalizedEmail,
    role: 'trainer',
    isVerified: trainerData.isVerified ?? false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  trainers.push(newTrainer);
  saveTrainers(trainers);
  return newTrainer;
};

const updateTrainer = (id, updates) => {
  const trainers = getAllTrainers();
  const trainerIndex = trainers.findIndex((trainer) => trainer._id === id);
  if (trainerIndex === -1) return null;

  trainers[trainerIndex] = {
    ...trainers[trainerIndex],
    ...updates,
    updatedAt: new Date(),
  };
  saveTrainers(trainers);
  return trainers[trainerIndex];
};

module.exports = {
  getAllTrainers,
  saveTrainers,
  findTrainerByEmail,
  findTrainerById,
  createTrainer,
  updateTrainer,
};
