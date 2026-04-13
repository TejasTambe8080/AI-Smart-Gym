// Seed script to populate Exercise collection with real workout data
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Import Exercise model
const Exercise = require('./models/Exercise');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym_ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Exercise data to be seeded
const exercisesData = [
  // CHEST - 4 exercises
  {
    name: 'Bench Press',
    muscleGroup: 'chest',
    difficulty: 'intermediate',
    description: 'Classic compound movement for chest development. Lie on bench and press weight up.',
    targetReps: 8,
    equipment: ['barbell', 'bench'],
    caloriesBurned: 180,
    instructions: [
      { order: 1, step: 'Lie on flat bench with feet on ground' },
      { order: 2, step: 'Grip bar slightly wider than shoulder width' },
      { order: 3, step: 'Lower bar to chest in controlled motion' },
      { order: 4, step: 'Press bar up to starting position' },
      { order: 5, step: 'Repeat for prescribed reps' },
    ],
  },
  {
    name: 'Incline Bench Press',
    muscleGroup: 'chest',
    difficulty: 'intermediate',
    description: 'Targets upper chest. Performed on inclined bench (30-45 degrees).',
    targetReps: 8,
    equipment: ['barbell', 'incline bench'],
    caloriesBurned: 160,
    instructions: [
      { order: 1, step: 'Set bench to 30-45 degree incline' },
      { order: 2, step: 'Lie back with feet firmly on ground' },
      { order: 3, step: 'Grip bar slightly wider than shoulders' },
      { order: 4, step: 'Lower weight to upper chest' },
      { order: 5, step: 'Push weight back up' },
    ],
  },
  {
    name: 'Dumbbell Chest Fly',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    description: 'Isolation exercise for chest. Requires dumbbells and bench.',
    targetReps: 12,
    equipment: ['dumbbell', 'bench'],
    caloriesBurned: 140,
    instructions: [
      { order: 1, step: 'Lie on bench holding dumbbells at chest level' },
      { order: 2, step: 'Extend arms slightly bent overhead' },
      { order: 3, step: 'Bring dumbbells back in controlled arc' },
      { order: 4, step: 'Squeeze chest at top' },
      { order: 5, step: 'Repeat motion smoothly' },
    ],
  },
  {
    name: 'Push-ups',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    description: 'Bodyweight exercise for chest, shoulders, and triceps.',
    targetReps: 15,
    equipment: ['bodyweight'],
    caloriesBurned: 120,
    instructions: [
      { order: 1, step: 'Get into plank position' },
      { order: 2, step: 'Hands shoulder-width apart' },
      { order: 3, step: 'Lower body until chest near ground' },
      { order: 4, step: 'Push back up to starting position' },
      { order: 5, step: 'Keep body in straight line' },
    ],
  },

  // BACK - 4 exercises
  {
    name: 'Pull-ups',
    muscleGroup: 'back',
    difficulty: 'advanced',
    description: 'Advanced compound exercise. Requires pull-up bar.',
    targetReps: 8,
    equipment: ['pull-up bar'],
    caloriesBurned: 200,
    instructions: [
      { order: 1, step: 'Grab bar with overhand grip, hands shoulder-width' },
      { order: 2, step: 'Hang with arms fully extended' },
      { order: 3, step: 'Pull yourself up until chest near bar' },
      { order: 4, step: 'Lower yourself down slowly' },
      { order: 5, step: 'Repeat with control' },
    ],
  },
  {
    name: 'Deadlift',
    muscleGroup: 'back',
    difficulty: 'advanced',
    description: 'Powerful full-body exercise focusing on back and legs.',
    targetReps: 6,
    equipment: ['barbell'],
    caloriesBurned: 220,
    instructions: [
      { order: 1, step: 'Stand with feet hip-width apart' },
      { order: 2, step: 'Bar over mid-foot' },
      { order: 3, step: 'Bend knees and grab bar' },
      { order: 4, step: 'Drive through heels to stand up' },
      { order: 5, step: 'Lower bar with control' },
    ],
  },
  {
    name: 'Lat Pulldown',
    muscleGroup: 'back',
    difficulty: 'intermediate',
    description: 'Machine-based exercise for back width.',
    targetReps: 12,
    equipment: ['cable machine'],
    caloriesBurned: 150,
    instructions: [
      { order: 1, step: 'Sit at lat pulldown machine' },
      { order: 2, step: 'Grip bar slightly wider than shoulders' },
      { order: 3, step: 'Pull bar down to upper chest' },
      { order: 4, step: 'Squeeze back muscles' },
      { order: 5, step: 'Return to starting position' },
    ],
  },
  {
    name: 'Bent-Over Barbell Rows',
    muscleGroup: 'back',
    difficulty: 'intermediate',
    description: 'Compound row exercise for thick back development.',
    targetReps: 8,
    equipment: ['barbell'],
    caloriesBurned: 190,
    instructions: [
      { order: 1, step: 'Hinge at hips with barbell in hands' },
      { order: 2, step: 'Keep chest up, back straight' },
      { order: 3, step: 'Row weight up to waist' },
      { order: 4, step: 'Squeeze shoulder blades together' },
      { order: 5, step: 'Lower weight with control' },
    ],
  },

  // BICEPS - 3 exercises
  {
    name: 'Dumbbell Curl',
    muscleGroup: 'biceps',
    difficulty: 'beginner',
    description: 'Classic isolation exercise for bicep development.',
    targetReps: 12,
    equipment: ['dumbbell'],
    caloriesBurned: 100,
    instructions: [
      { order: 1, step: 'Stand with dumbbells at sides' },
      { order: 2, step: 'Palms facing forward' },
      { order: 3, step: 'Curl weights up to shoulders' },
      { order: 4, step: 'Squeeze biceps at top' },
      { order: 5, step: 'Lower with control' },
    ],
  },
  {
    name: 'Hammer Curl',
    muscleGroup: 'biceps',
    difficulty: 'beginner',
    description: 'Variation targeting biceps and forearms.',
    targetReps: 12,
    equipment: ['dumbbell'],
    caloriesBurned: 110,
    instructions: [
      { order: 1, step: 'Hold dumbbells with palms facing each other' },
      { order: 2, step: 'Curl weights up to shoulders' },
      { order: 3, step: 'Keep wrists neutral' },
      { order: 4, step: 'Squeeze at top' },
      { order: 5, step: 'Lower under control' },
    ],
  },
  {
    name: 'Concentration Curl',
    muscleGroup: 'biceps',
    difficulty: 'beginner',
    description: 'Seated isolation exercise with maximum muscle contraction.',
    targetReps: 12,
    equipment: ['dumbbell'],
    caloriesBurned: 95,
    instructions: [
      { order: 1, step: 'Sit on bench, legs apart' },
      { order: 2, step: 'Lean forward and support dumbbell' },
      { order: 3, step: 'Curl weight up with concentration' },
      { order: 4, step: 'Feel maximum squeeze' },
      { order: 5, step: 'Lower slowly' },
    ],
  },

  // TRICEPS - 3 exercises
  {
    name: 'Tricep Dips',
    muscleGroup: 'triceps',
    difficulty: 'intermediate',
    description: 'Bodyweight exercise for tricep strength.',
    targetReps: 10,
    equipment: ['bodyweight', 'dip bar'],
    caloriesBurned: 130,
    instructions: [
      { order: 1, step: 'Grip dip bar with hands' },
      { order: 2, step: 'Lower body by bending elbows' },
      { order: 3, step: 'Keep elbows close to body' },
      { order: 4, step: 'Push back up to starting position' },
      { order: 5, step: 'Repeat with control' },
    ],
  },
  {
    name: 'Skull Crushers',
    muscleGroup: 'triceps',
    difficulty: 'intermediate',
    description: 'Isolation exercise for tricep isolation.',
    targetReps: 12,
    equipment: ['dumbbell', 'barbell'],
    caloriesBurned: 120,
    instructions: [
      { order: 1, step: 'Lie on bench holding weight above head' },
      { order: 2, step: 'Bend elbows to lower weight behind head' },
      { order: 3, step: 'Keep upper arms stationary' },
      { order: 4, step: 'Extend elbows to return to start' },
      { order: 5, step: 'Repeat smoothly' },
    ],
  },
  {
    name: 'Overhead Tricep Extension',
    muscleGroup: 'triceps',
    difficulty: 'beginner',
    description: 'Standing exercise targeting tricep extension.',
    targetReps: 12,
    equipment: ['dumbbell', 'cable'],
    caloriesBurned: 110,
    instructions: [
      { order: 1, step: 'Stand holding weight overhead' },
      { order: 2, step: 'Bend elbows to lower weight behind head' },
      { order: 3, step: 'Keep upper arms stationary' },
      { order: 4, step: 'Extend arms overhead' },
      { order: 5, step: 'Maintain control throughout' },
    ],
  },

  // LEGS - 3 exercises
  {
    name: 'Squats',
    muscleGroup: 'legs',
    difficulty: 'intermediate',
    description: 'Compound movement for leg development.',
    targetReps: 10,
    equipment: ['barbell'],
    caloriesBurned: 200,
    instructions: [
      { order: 1, step: 'Stand with feet shoulder-width apart' },
      { order: 2, step: 'Lower body by bending knees' },
      { order: 3, step: 'Keep chest up and core tight' },
      { order: 4, step: 'Go down until thighs parallel to ground' },
      { order: 5, step: 'Drive through heels to return to start' },
    ],
  },
  {
    name: 'Leg Press',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    description: 'Machine-based leg exercise for strength.',
    targetReps: 12,
    equipment: ['leg press machine'],
    caloriesBurned: 180,
    instructions: [
      { order: 1, step: 'Sit in leg press machine' },
      { order: 2, step: 'Place feet shoulder-width on platform' },
      { order: 3, step: 'Lower weight by bending knees' },
      { order: 4, step: 'Push back to starting position' },
      { order: 5, step: 'Repeat smoothly' },
    ],
  },
  {
    name: 'Lunges',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    description: 'Single-leg exercise for balance and strength.',
    targetReps: 12,
    equipment: ['bodyweight', 'dumbbell'],
    caloriesBurned: 150,
    instructions: [
      { order: 1, step: 'Stand with feet together' },
      { order: 2, step: 'Step forward and lower body' },
      { order: 3, step: 'Keep torso upright' },
      { order: 4, step: 'Push back to starting position' },
      { order: 5, step: 'Alternate legs' },
    ],
  },

  // ABS - 3 exercises
  {
    name: 'Crunches',
    muscleGroup: 'abs',
    difficulty: 'beginner',
    description: 'Classic core exercise for abdominal strength.',
    targetReps: 20,
    equipment: ['bodyweight'],
    caloriesBurned: 80,
    instructions: [
      { order: 1, step: 'Lie on back with knees bent' },
      { order: 2, step: 'Hands behind head or crossed on chest' },
      { order: 3, step: 'Crunch up, lifting shoulders off ground' },
      { order: 4, step: 'Feel abs contract' },
      { order: 5, step: 'Lower back down with control' },
    ],
  },
  {
    name: 'Plank',
    muscleGroup: 'abs',
    difficulty: 'beginner',
    description: 'Isometric core exercise for stability.',
    targetReps: 1,
    equipment: ['bodyweight'],
    caloriesBurned: 100,
    instructions: [
      { order: 1, step: 'Get into forearm plank position' },
      { order: 2, step: 'Keep body in straight line' },
      { order: 3, step: 'Engage core' },
      { order: 4, step: 'Hold for time (30-60 seconds)' },
      { order: 5, step: 'Rest and repeat' },
    ],
  },
  {
    name: 'Leg Raises',
    muscleGroup: 'abs',
    difficulty: 'intermediate',
    description: 'Advanced core exercise targeting lower abs.',
    targetReps: 12,
    equipment: ['bodyweight'],
    caloriesBurned: 120,
    instructions: [
      { order: 1, step: 'Lie on back, legs straight' },
      { order: 2, step: 'Raise legs up to 90 degrees' },
      { order: 3, step: 'Keep lower back on ground' },
      { order: 4, step: 'Lower legs without touching ground' },
      { order: 5, step: 'Repeat controlled motion' },
    ],
  },

  // CARDIO - 3 exercises
  {
    name: 'Jumping Jacks',
    muscleGroup: 'cardio',
    difficulty: 'beginner',
    description: 'Full-body cardio exercise for heart rate elevation.',
    targetReps: 30,
    equipment: ['bodyweight'],
    caloriesBurned: 150,
    instructions: [
      { order: 1, step: 'Stand with feet together' },
      { order: 2, step: 'Jump while spreading feet and raising arms' },
      { order: 3, step: 'Land in wide stance with arms up' },
      { order: 4, step: 'Jump back to starting position' },
      { order: 5, step: 'Keep rhythm continuous' },
    ],
  },
  {
    name: 'Burpees',
    muscleGroup: 'cardio',
    difficulty: 'intermediate',
    description: 'Full-body explosive cardio exercise.',
    targetReps: 15,
    equipment: ['bodyweight'],
    caloriesBurned: 200,
    instructions: [
      { order: 1, step: 'Stand with feet shoulder-width apart' },
      { order: 2, step: 'Crouch down and place hands on ground' },
      { order: 3, step: 'Jump feet back into plank position' },
      { order: 4, step: 'Jump feet back to crouch' },
      { order: 5, step: 'Jump up with arms overhead' },
    ],
  },
  {
    name: 'Mountain Climbers',
    muscleGroup: 'cardio',
    difficulty: 'beginner',
    description: 'Core and cardio exercise combining strength and endurance.',
    targetReps: 30,
    equipment: ['bodyweight'],
    caloriesBurned: 180,
    instructions: [
      { order: 1, step: 'Get into plank position' },
      { order: 2, step: 'Bring one knee toward chest' },
      { order: 3, step: 'Quickly switch legs in running motion' },
      { order: 4, step: 'Keep hips level' },
      { order: 5, step: 'Maintain steady pace' },
    ],
  },
];

// Seed database
const seedDatabase = async () => {
  try {
    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('✅ Cleared existing exercises');

    // Insert new exercises
    const result = await Exercise.insertMany(exercisesData);
    console.log(`✅ Seeded ${result.length} exercises successfully!`);

    // Show summary by muscle group
    const stats = await Exercise.aggregate([
      {
        $group: {
          _id: '$muscleGroup',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log('\n📊 Exercise Count by Muscle Group:');
    stats.forEach((stat) => {
      console.log(`   ${stat._id}: ${stat.count} exercises`);
    });

    console.log('\n✨ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
