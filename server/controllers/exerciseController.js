// Exercises Controller - Fetches and manages exercises
const Exercise = require('../models/Exercise');

/**
 * @desc    Get all exercises or filter by muscle group
 * @route   GET /api/exercises
 * @query   muscleGroup (optional), difficulty (optional)
 * @access  Public
 */
exports.getExercises = async (req, res, next) => {
  try {
    const { muscleGroup, difficulty } = req.query;
    let query = {};

    // Build filter query
    if (muscleGroup) {
      query.muscleGroup = muscleGroup.toLowerCase();
    }
    if (difficulty) {
      query.difficulty = difficulty.toLowerCase();
    }

    const exercises = await Exercise.find(query).sort({ muscleGroup: 1, name: 1 });

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No exercises found',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get exercises by muscle group
 * @route   GET /api/exercises/group/:muscleGroup
 * @access  Public
 */
exports.getExercisesByMuscleGroup = async (req, res, next) => {
  try {
    const { muscleGroup } = req.params;
    
    const exercises = await Exercise.find({
      muscleGroup: muscleGroup.toLowerCase(),
    }).sort({ difficulty: 1, name: 1 });

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No exercises found for muscle group: ${muscleGroup}`,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: exercises.length,
      muscleGroup: muscleGroup.toLowerCase(),
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single exercise by ID
 * @route   GET /api/exercises/:id
 * @access  Public
 */
exports.getExerciseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found',
      });
    }

    res.status(200).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all available muscle groups
 * @route   GET /api/exercises/groups/list/all
 * @access  Public
 */
exports.getMuscleGroups = async (req, res, next) => {
  try {
    const groups = await Exercise.distinct('muscleGroup');
    
    // Get count for each group
    const groupStats = await Promise.all(
      groups.map(async (group) => {
        const count = await Exercise.countDocuments({ muscleGroup: group });
        return { group, count };
      })
    );

    res.status(200).json({
      success: true,
      groups: groupStats.sort((a, b) => a.group.localeCompare(b.group)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get exercises by difficulty level
 * @route   GET /api/exercises/difficulty/:level
 * @access  Public
 */
exports.getExercisesByDifficulty = async (req, res, next) => {
  try {
    const { level } = req.params;
    const exercises = await Exercise.find({
      difficulty: level.toLowerCase(),
    }).sort({ muscleGroup: 1, name: 1 });

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No exercises found for difficulty: ${level}`,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: exercises.length,
      difficulty: level.toLowerCase(),
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new exercise (Admin only)
 * @route   POST /api/exercises
 * @access  Private/Admin
 */
exports.createExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Exercise created successfully',
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update exercise (Admin only)
 * @route   PUT /api/exercises/:id
 * @access  Private/Admin
 */
exports.updateExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exercise updated successfully',
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete exercise (Admin only)
 * @route   DELETE /api/exercises/:id
 * @access  Private/Admin
 */
exports.deleteExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByIdAndDelete(id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exercise deleted successfully',
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search exercises by name
 * @route   GET /api/exercises/search/:query
 * @access  Public
 */
exports.searchExercises = async (req, res, next) => {
  try {
    const { query } = req.params;
    
    const exercises = await Exercise.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};
