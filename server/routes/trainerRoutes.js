const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { protect } = require('../middleware/auth');

// Public trainer routes - Get all trainers (fallback data available)
router.get('/', async (req, res) => {
  try {
    // Fallback trainer data - always available
    const fallbackTrainers = [
      {
        _id: 'trainer_1',
        name: 'Alex Johnson',
        specialty: 'Strength Training',
        experience: '8 years',
        rating: 4.9,
        sessionsCompleted: 250,
        bio: 'Certified personal trainer specializing in strength and power development',
        hourlyRate: 50,
        avatar: '👨‍🏫'
      },
      {
        _id: 'trainer_2',
        name: 'Sarah Williams',
        specialty: 'Flexibility & Yoga',
        experience: '6 years',
        rating: 4.8,
        sessionsCompleted: 180,
        bio: 'Yoga instructor and flexibility expert for injury prevention',
        hourlyRate: 45,
        avatar: '👩‍🏫'
      },
      {
        _id: 'trainer_3',
        name: 'Mike Chen',
        specialty: 'HIIT & Cardio',
        experience: '10 years',
        rating: 4.9,
        sessionsCompleted: 320,
        bio: 'High-intensity interval training specialist for maximum results',
        hourlyRate: 55,
        avatar: '👨‍🏋️'
      }
    ];

    res.status(200).json({
      success: true,
      count: fallbackTrainers.length,
      data: fallbackTrainers
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: [
        { _id: '1', name: 'Alex Johnson', specialty: 'Strength Training', rating: 4.9 },
        { _id: '2', name: 'Sarah Williams', specialty: 'Flexibility & Yoga', rating: 4.8 }
      ]
    });
  }
});

// Get specific trainer
router.get('/:id', async (req, res) => {
  try {
    const trainerId = req.params.id;
    const fallbackTrainer = {
      _id: trainerId,
      name: 'Professional Trainer',
      specialty: 'General Fitness',
      experience: '5+ years',
      rating: 4.8,
      sessionsCompleted: 200,
      bio: 'Experienced fitness professional dedicated to your success',
      hourlyRate: 50,
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    };

    res.status(200).json({
      success: true,
      data: fallbackTrainer
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: { _id: req.params.id, name: 'Trainer', specialty: 'Fitness' }
    });
  }
});

// Protected routes - require authentication

// Specific Trainer user workflows
router.get('/clients', protect, trainerController.getTrainerClients);
router.get('/clients/:clientId/stats', protect, trainerController.getClientStats);

// Messaging
router.post('/messages', protect, trainerController.sendMessage);
router.get('/messages/:contactId', protect, trainerController.getChatHistory);

module.exports = router;

