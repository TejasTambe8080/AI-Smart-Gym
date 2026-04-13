# 🏋️ AI-Based Smart Gym - Intelligent Fitness Platform

A full-stack intelligent fitness application that combines **AI-powered posture detection**, **real-time rep counting**, **performance analytics**, and **dynamic exercise database** to deliver a modern fitness experience.

## ✨ Features

### 👤 User Management
- **Authentication System** - Secure signup/login with JWT
- **Profile Management** - Track user data and preferences
- **Personalized Dashboard** - View stats, progress, and recommendations

### 🏋️ Dynamic Exercise System
- **Database-Driven Exercises** - 21+ real exercises with detailed instructions
- **Muscle Group Filtering** - Browse exercises by target muscle group
- **Difficulty Levels** - Exercises categorized as Beginner, Intermediate, Advanced
- **Exercise Details** - Full descriptions, form instructions, equipment info, calorie estimates

### 🤖 AI-Powered Workout Features
- **Real-Time Posture Detection** - MediaPipe-based form detection
- **Automated Rep Counting** - Accurate rep detection with AI
- **Posture Scoring** - 0-100% form accuracy feedback
- **Performance Analytics** - Detailed metrics and suggestions

### 📊 Analytics Dashboard
- **Workout History** - Track all completed workouts
- **Performance Metrics** - Reps, duration, calories, posture score
- **Progress Charts** - Visual representation of fitness journey
- **AI Suggestions** - Personalized tips to improve form and performance

### 🎙️ Voice Feedback System
- **Real-Time Coaching** - Voice prompts during workouts
- **Audio Cues** - Rep counting and form corrections
- **Performance Announcements** - Voice feedback on completion

### 🎨 Modern UI
- **Professional Design** - Tailwind CSS responsive interface
- **SaaS-Style Layout** - Modern metrics and cards
- **Real-Time Updates** - Live workout tracking
- **Dark/Light Themes** - Adaptive color schemes

## 🛠️ Tech Stack

### Frontend
```
React 18
React Router DOM (Navigation)
Tailwind CSS (Styling)
Axios (API Calls)
MediaPipe (Pose Detection)
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
