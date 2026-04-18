# 🏋️ FormFix AI - Premium AI-Powered Fitness Platform

A full-stack intelligent fitness application combining **AI-powered form detection**, **real-time rep counting**, **advanced analytics**, and **personalized coaching** to deliver a premium fitness experience.

## ✨ Premium Features

### 🤖 AI-Powered Features
- **🏋️ Real-Time Form Detection** - MediaPipe-based posture analysis
- **📊 Form Score System** - Weighted formula: (Posture×0.4) + (Reps×0.3) + (Consistency×0.3)
- **⚡ Automated Rep Counting** - Accurate detection with real-time feedback
- **🧠 AI Workout Planner** - Gemini-powered 7-day personalized plans
- **🎙️ AI Coach Chat** - Real-time coaching with instant responses
- **💪 Weak Muscle Detection** - Analyze history, identify weak groups
- **🚨 Injury Risk Detection** - Monitor form degradation, alert system

### 🎮 Gamification System
- **🔥 Streak Tracking** - Build daily workout streaks with notifications
- **🏆 Badge Achievements** - Earn badges for milestones (7-day, 100 reps, 1 hour, etc.)
- **📈 Level System** - Progress through levels (1-10+) with XP tracking
- **🥇 Leaderboards** - Compare with other users (premium feature)

### 📊 Advanced Analytics
- **Dashboard Metrics** - Total workouts, duration, posture %, calories
- **Performance Trends** - Form score history, weekly progress, muscle balance
- **Personal Records** - Track max weight, best form, fastest reps
- **Weekly Goals** - Set targets (1-7 workouts/week) with progress tracking

### 👤 User Personalization
- **Profile Management** - Height, weight, goals, experience level
- **Settings Configuration** - Notifications, voice feedback, sound effects, preferences
- **Fitness Goals** - Muscle gain, weight loss, strength, endurance, flexibility
- **Experience Levels** - Beginner, Intermediate, Advanced, Elite

### 🏋️ Workout System
- **21+ Real Exercises** - Database-driven with full instructions
- **Posture Correction** - Real-time form feedback with visual guides
- **Custom Workouts** - Create and save personalized workout plans
- **AI-Generated Plans** - Personalized 7-day workout plans from Gemini

### 📱 Modern SaaS UI
- **Premium Dark Theme** - Gradient backgrounds, elevated cards
- **Responsive Design** - Optimized for mobile, tablet, desktop
- **Smooth Animations** - Transitions, hover effects, loading states
- **Intuitive Navigation** - Sidebar menu with color-coded sections

## 🛠️ Tech Stack

### Frontend
```
React 18 with Hooks
React Router v6 (Navigation)
Tailwind CSS (Premium dark theme)
Axios (API Integration)
MediaPipe (Pose Detection)
Recharts (Analytics)
Google Generative AI
```

### Backend
```
Node.js
Express.js
MongoDB
Mongoose ODM
JWT Authentication
```

### AI/ML
```
MediaPipe Pose
TensorFlow.js (optional enhancements)
Rep Detection Algorithm
Posture Scoring System
```

## 📁 Project Structure

```
AI_BASED_SMART_GYM/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExerciseCard.js      # Reusable exercise component
│   │   │   ├── MediaPipePose.js     # Pose detection component
│   │   │   ├── Layout.js            # Main layout wrapper
│   │   │   └── Navigation.js        # Navigation bar
│   │   ├── pages/
│   │   │   ├── Dashboard.js         # User dashboard
│   │   │   ├── WorkoutRefactored.js # 5-step workout flow (DYNAMIC)
│   │   │   ├── Analytics.js         # Performance analytics
│   │   │   ├── Profile.js           # User profile
│   │   │   ├── Login.js             # Authentication
│   │   │   ├── Signup.js            # Registration
│   │   │   └── [Other Pages]
│   │   ├── hooks/
│   │   │   ├── useExercises.js      # Exercise data fetching
│   │   │   └── useVoiceFeedback.js  # Voice system
│   │   ├── services/
│   │   │   └── api.js               # API integration
│   │   └── utils/
│   │       └── ai/                  # AI utilities
│   │           ├── repCounter.js
│   │           ├── postureDetection.js
│   │           ├── performanceScoring.js
│   │           └── voiceFeedback.js
│   └── [Config files]
│
├── server/                          # Express Backend
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Exercise.js              # Exercise schema (NEW)
│   │   └── Workout.js               # Workout history
│   ├── controllers/
│   │   ├── authController.js        # Auth logic
│   │   ├── exerciseController.js    # Exercise endpoints (NEW)
│   │   └── workoutController.js     # Workout logic
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── exerciseRoutes.js        # Exercise routes (NEW)
│   │   └── workoutRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── seed.js                      # Populate database with exercises
│   ├── server.js                    # Express server entry
│   └── .env                         # Environment variables
│
└── ai/                              # AI modules (legacy)
    └── [Utility functions]
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/TejasTambe8080/AI-Smart-Gym.git
cd AI_BASED_SMART_GYM
```

#### 2. Setup Backend
```bash
cd server
npm install

# Configure .env
# MONGODB_URI=mongodb://localhost:27017/ai_gym
# JWT_SECRET=your_secret_key
# PORT=5000

# Populate database with exercises
node seed.js

# Start server
npm start
```

#### 3. Setup Frontend
```bash
cd ../client
npm install
npm start
```

The application will open at `http://localhost:3000`

## 📖 API Documentation

### Exercise Endpoints

#### Get All Exercises
```
GET /api/exercises
Query: ?muscleGroup=chest&difficulty=beginner
Response: { success: true, count: 21, data: [...] }
```

#### Get Exercises by Muscle Group
```
GET /api/exercises/group/:muscleGroup
Response: { success: true, count: 4, data: [...] }
```

#### Get All Muscle Groups
```
GET /api/exercises/groups/list/all
Response: {
  success: true,
  data: [
    { group: "chest", count: 4 },
    { group: "back", count: 4 },
    ...
  ]
}
```

#### Get Exercise by ID
```
GET /api/exercises/:id
Response: { success: true, data: {...exercise details...} }
```

#### Filter by Difficulty
```
GET /api/exercises/difficulty/:level
Response: { success: true, count: 7, data: [...] }
```

#### Search Exercises
```
GET /api/exercises/search/:query
Response: { success: true, count: 3, data: [...] }
```

## 🏋️ Workout Flow

The application follows a **5-step workout process**:

### Step 1: Muscle Group Selection
- User selects target muscle group
- System fetches available muscle groups from `/api/exercises/groups/list/all`
- Shows exercise count for each group

### Step 2: Exercise Selection (DYNAMIC FROM DATABASE)
- User selects specific exercise
- System fetches exercises from `/api/exercises/group/:muscleGroup`
- ExerciseCard component displays each exercise dynamically
- **NOT hardcoded** - all data from MongoDB

### Step 3: Exercise Details
- Display full exercise information
- Proper form instructions (5 steps)
- Equipment requirements
- Target reps and difficulty

### Step 4: Live Workout
- Real-time pose detection via MediaPipe
- Rep counter updates in real-time
- Posture score (0-100%)
- Timer
- Voice feedback (optional)

### Step 5: Results Summary
- Performance score
- Reps completed
- Duration and calories
- AI suggestions for improvement
- Option to start another workout

## 🗄️ Database Schema

### Exercise Model
```javascript
{
  name: String,                    // e.g., "Push-ups"
  muscleGroup: String (enum),      // chest, back, biceps, triceps, legs, abs, cardio
  difficulty: String (enum),       // beginner, intermediate, advanced
  description: String,             // Brief description
  instructions: [{                 // 5-step form guide
    order: Number,
    step: String
  }],
  targetReps: Number,             // e.g., 15
  image: String (URL),            // Exercise image
  video: String (URL, optional),  // Exercise video
  equipment: [String],            // e.g., ["None", "Dumbbell"]
  caloriesBurned: Number          // Estimated calories for 10 reps
}
```

### Sample Exercise Data
```javascript
{
  name: "Push-ups",
  muscleGroup: "chest",
  difficulty: "beginner",
  description: "Upper body push exercise for chest, shoulders, and triceps",
  targetReps: 15,
  equipment: ["None"],
  caloriesBurned: 7
  // ... instructions, images, etc.
}
```

## 🔌 Custom Hooks

### useExercises(muscleGroup)
```javascript
const { exercises, loading, error } = useExercises('chest');
```
- Fetches exercises from API
- Handles loading and error states
- Filters by muscle group

### useMuscleGroups()
```javascript
const { groups, loading, error } = useMuscleGroups();
```
- Fetches all muscle groups with counts
- Returns: `[{ group: "chest", count: 4 }, ...]`

## 🎯 Key Features Implementation

### Dynamic Exercise System ✅
- **Before**: Hardcoded 2 exercises per muscle group
- **After**: 21 real exercises from MongoDB with full details
- All fetched dynamically from 9 REST API endpoints
- Filtered by muscle group, difficulty, searchable

### AI-Powered Posture Detection ✅
- Real-time MediaPipe pose analysis
- Joint angle calculations
- Posture feedback system
- Form scoring (0-100%)

### Performance Analytics ✅
- Rep counting algorithm
- Duration tracking
- Calorie estimation
- Consistency scoring
- AI-generated suggestions

### Modern UI Design ✅
- Tailwind CSS responsive layout
- Professional SaaS-style components
- Real-time state updates
- Smooth animations and transitions

## 🔒 Security

- JWT-based authentication
- Protected user routes
- Password hashing
- MongoDB injection protection
- CORS configuration
- Environment variables for secrets

## 📊 Database Statistics

**Seeded Exercises**: 21 total
- Chest: 4 exercises
- Back: 4 exercises
- Biceps: 3 exercises
- Triceps: 3 exercises
- Legs: 3 exercises
- Abs: 3 exercises
- Cardio: 2 exercises

Each exercise includes:
- Full description
- 5-step form instructions
- Equipment list
- Difficulty level
- Target reps
- Calorie estimates

## 🚀 Performance Optimizations

- Database indexing on muscle groups and difficulty
- Axios request interceptors for token injection
- Lazy loading of components
- Memoized React components
- Efficient pose detection processing

## 📝 Environment Variables

Required in `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/ai_gym
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 👨‍💻 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For support, email: tejastavbe@example.com  
GitHub Issues: https://github.com/TejasTambe8080/AI-Smart-Gym/issues

## 🎓 Learning Resources

This project demonstrates:
- Full-stack MERN development
- Database schema design and indexing
- RESTful API design patterns
- Custom React hooks
- Component composition
- AI/ML integration (MediaPipe)
- Real-time data processing
- State management in React
- JWT authentication flow
- MongoDB aggregation

Perfect for portfolio building and technical interview preparation! 🚀

---

**Built with ❤️ by Tejas Tambe**

### Key Highlights for Interviewers:
✅ Production-ready code structure
✅ Database-driven architecture
✅ Dynamic exercise system (not hardcoded)
✅ 21 real exercises with full details
✅ AI-powered posture detection
✅ Real-time rep counting
✅ Performance analytics
✅ Professional UI design
✅ Comprehensive error handling
✅ Scalable API design
