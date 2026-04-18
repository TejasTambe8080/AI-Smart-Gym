// Workout Controller - Handles CRUD operations for workouts
const Workout = require('../models/Workout');
const statsController = require('./statsController');

// @route   POST /api/workouts
// @desc    Create a new workout session
// @access  Private
exports.createWorkout = async (req, res) => {
  try {
    const {
      exerciseType,
      reps,
      sets,
      duration,
      postureScore,
      caloriesBurned,
      notes,
      postureDetails,
      performanceMetrics,
    } = req.body;

    // Validation
    if (!exerciseType || reps === undefined || !duration) {
      return res.status(400).json({
        message: 'Please provide exerciseType, reps, and duration',
      });
    }

    const workout = new Workout({
      userId: req.userId,
      exerciseType,
      reps,
      sets,
      duration,
      postureScore,
      caloriesBurned,
      notes,
      postureDetails,
      performanceMetrics,
    });

    await workout.save();

    // Update user stats and trigger notifications
    try {
      await statsController.updateStatsAfterWorkout(req.userId, workout);
    } catch (statsError) {
      console.error('Error updating stats:', statsError);
      // Don't fail the response if stats update fails
    }

    res.status(201).json({
      message: 'Workout created successfully',
      workout,
    });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/workouts
// @desc    Get all workouts for authenticated user
// @access  Private
exports.getWorkouts = async (req, res) => {
  try {
    const { startDate, endDate, exerciseType } = req.query;

    // Build filter
    const filter = { userId: req.userId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    if (exerciseType) {
      filter.exerciseType = exerciseType;
    }

    const workouts = await Workout.find(filter).sort({ date: -1 });

    res.status(200).json({
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/workouts/:id
// @desc    Get a specific workout
// @access  Private
exports.getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.status(200).json({ workout });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/workouts/:id
// @desc    Update a workout
// @access  Private
exports.updateWorkout = async (req, res) => {
  try {
    let workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Update fields
    Object.assign(workout, req.body);
    await workout.save();

    res.status(200).json({
      message: 'Workout updated successfully',
      workout,
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout
// @access  Private
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/workouts/stats/summary
// @desc    Get workout statistics
// @access  Private
exports.getWorkoutStats = async (req, res) => {
  try {
    const { period } = req.query; // 'day', 'week', 'month'
    const now = new Date();
    let startDate = new Date();

    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate.setHours(0, 0, 0, 0);
    }

    const workouts = await Workout.find({
      userId: req.userId,
      date: { $gte: startDate },
    });

    // Calculate stats
    const stats = {
      totalWorkouts: workouts.length,
      totalReps: workouts.reduce((sum, w) => sum + w.reps, 0),
      totalSets: workouts.reduce((sum, w) => sum + w.sets, 0),
      totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0), // in seconds
      totalCalories: workouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
      averagePostureScore:
        workouts.length > 0
          ? Math.round(
              workouts.reduce((sum, w) => sum + w.postureScore, 0) / workouts.length
            )
          : 0,
      exerciseBreakdown: {},
    };

    // Exercise breakdown
    workouts.forEach((w) => {
      if (!stats.exerciseBreakdown[w.exerciseType]) {
        stats.exerciseBreakdown[w.exerciseType] = 0;
      }
      stats.exerciseBreakdown[w.exerciseType]++;
    });

    res.status(200).json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
