const Workout = require('../models/Workout');
const UserStats = require('../models/UserStats');

/**
 * Generates an emotional "Journey" summary based on biometric evolution.
 */
exports.getProgressionStory = async (req, res) => {
  try {
    const userId = req.userId;
    
    // 1. Fetch First vs Latest Workouts
    const firstWorkouts = await Workout.find({ userId }).sort({ date: 1 }).limit(3);
    const latestWorkouts = await Workout.find({ userId }).sort({ date: -1 }).limit(3);
    const stats = await UserStats.findOne({ userId });

    if (firstWorkouts.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'Journey just beginning. Synchronize your first protocol to start the narrative.',
        data: null 
      });
    }

    // 2. Evolution Analysis
    const firstAvgPosture = firstWorkouts.reduce((s, w) => s + w.postureScore, 0) / firstWorkouts.length;
    const latestAvgPosture = latestWorkouts.reduce((s, w) => s + w.postureScore, 0) / latestWorkouts.length;
    const postureImprovement = Math.round(((latestAvgPosture - firstAvgPosture) / firstAvgPosture) * 100);

    const firstAvgReps = firstWorkouts.reduce((s, w) => s + w.reps, 0) / firstWorkouts.length;
    const latestAvgReps = latestWorkouts.reduce((s, w) => s + w.reps, 0) / latestWorkouts.length;
    const strengthGrowth = Math.round(((latestAvgReps - firstAvgReps) / firstAvgReps) * 100);

    // 3. Narrative Milestones
    const milestones = [];
    
    if (stats.totalWorkouts >= 1) {
      milestones.push({
        title: 'Neural Link Established',
        date: firstWorkouts[0].date,
        description: 'Synchronized your first biometric sequence. The evolution cycle has initiated.',
        icon: '🧬'
      });
    }

    if (postureImprovement > 0) {
      milestones.push({
        title: 'Precision Breakthrough',
        date: latestWorkouts[0].date,
        description: `Your neural precision (posture) improved by ${postureImprovement}% since iteration zero.`,
        icon: '🎯'
      });
    }

    if (stats.totalWorkouts >= 10) {
       milestones.push({
        title: 'Consistency Anchor',
        date: new Date(),
        description: 'Successfully reached 10 completed protocols. Building the foundation of mastery.',
        icon: '🏛️'
      });
    }

    if (stats.currentStreak >= 3) {
      milestones.push({
        title: 'Kinetic Momentum',
        date: new Date(),
        description: `Maintained active neural bridge for ${stats.currentStreak} consecutive cycles.`,
        icon: '🔥'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        journeyMetrics: {
          postureImprovement,
          strengthGrowth,
          totalEvolution: stats.totalXP,
          firstDate: firstWorkouts[0].date,
          latestDate: latestWorkouts[0].date
        },
        milestones: milestones.sort((a, b) => new Date(b.date) - new Date(a.date))
      }
    });

  } catch (error) {
    console.error('Progression Story Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
