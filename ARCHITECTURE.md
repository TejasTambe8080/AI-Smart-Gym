# 🏗️ System Architecture

## High-Level Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                     AI SMART GYM APPLICATION                      │
└──────────────────────────────────────────────────────────────────┘

    ┌─────────────────────┐              ┌──────────────────────┐
    │   REACT FRONTEND    │◄────────────►│   NODEJS BACKEND     │
    │   (Port 3000)       │   REST API   │   (Port 5000)        │
    │                     │   (Axios)    │                      │
    └─────────────────────┘              └──────────────────────┘
              │                                      │
              │                                      │
         (Local Dev)                          ┌──────┴──────┐
              │                               │             │
              ▼                               ▼             ▼
    ┌──────────────────┐          ┌──────────────────┐  ┌─────────┐
    │  MediaPipe Pose  │          │ MongoDB Database │  │  JWT    │
    │  Detection (AI)  │          │   (Exercise DB)  │  │ Auth    │
    └──────────────────┘          └──────────────────┘  └─────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App.js
├── Layout.js (Navigation wrapper)
│   ├── Header
│   ├── Sidebar
│   └── Main Content
│       ├── LoginPage.js
│       ├── Dashboard.js
│       ├── WorkoutRefactored.js (5-Step Flow)
│       │   ├── Step 1: Muscle Selection
│       │   ├── Step 2: Exercise Selection (Dynamic)
│       │   ├── Step 3: Exercise Details
│       │   ├── Step 4: Live Workout
│       │   └── Step 5: Results
│       ├── Analytics.js
│       ├── Profile.js
│       └── Other Pages
│
Components/
├── ExerciseCard.js (Reusable exercise display)
├── MediaPipePose.js (Pose detection component)
├── Navigation.js
├── ProtectedRoute.js (Auth wrapper)
└── Layout.js

Hooks/
├── useExercises.js (Fetch exercises from API)
├── useMuscleGroups.js (Fetch muscle groups)
└── useVoiceFeedback.js (Voice system)

Services/
└── api.js (Axios client with exerciseService)

Utils/
└── ai/
    ├── repCounter.js (Rep detection)
    ├── postureDetection.js (Form analysis)
    ├── performanceScoring.js (Metrics)
    └── voiceFeedback.js (Audio feedback)
```

### Data Flow (Exercise Selection)

```
WorkoutRefactored.js (Main Component)
         │
         ├─► Step 1: Muscle Selection
         │   │
         │   ├─► useMuscleGroups() hook
         │   │   │
         │   │   ├─► GET /api/exercises/groups/list/all
         │   │   │
         │   │   └─► Response: [{group: "chest", count: 4}, ...]
         │   │
         │   └─► Display muscle group buttons
         │
         ├─► Step 2: Exercise Selection (DYNAMIC)
         │   │
         │   ├─► useExercises(muscleGroup) hook
         │   │   │
         │   │   ├─► GET /api/exercises/group/:muscleGroup
         │   │   │
         │   │   └─► Response: [{_id, name, difficulty, ...}, ...]
         │   │
         │   ├─► Map exercises to ExerciseCard components
         │   │
         │   └─► User selects exercise
         │
         ├─► Step 3: Exercise Details
         │   │
         │   └─► Display full exercise information
         │
         ├─► Step 4: Live Workout
         │   │
         │   ├─► MediaPipePose component (real-time)
         │   │
         │   ├─► RepCounter (detect reps)
         │   │
         │   ├─► PostureDetector (form scoring)
         │   │
         │   └─► VoiceFeedback (audio cues)
         │
         └─► Step 5: Results
             │
             ├─► POST /api/workouts (save workout)
             │
             └─► Display performance summary
```

---

## Backend Architecture

### API Layer

```
server.js (Entry Point)
│
├─► Database Connection (MongoDB Atlas/Local)
│
├─► Middleware
│   ├── cors()
│   ├── express.json()
│   ├── errorHandler
│   ├── logger
│   └── authMiddleware
│
├─► Routes
│   ├── /api/auth (authRoutes)
│   │   ├── POST /register
│   │   ├── POST /login
│   │   └── GET /profile
│   │
│   ├── /api/exercises (exerciseRoutes) ◄──── NEW!
│   │   ├── GET / (all exercises)
│   │   ├── GET /group/:muscleGroup
│   │   ├── GET /groups/list/all
│   │   ├── GET /:id
│   │   ├── GET /difficulty/:level
│   │   ├── GET /search/:query
│   │   ├── POST / (admin)
│   │   ├── PUT /:id (admin)
│   │   └── DELETE /:id (admin)
│   │
│   └── /api/workouts (workoutRoutes)
│       ├── POST / (create workout record)
│       ├── GET / (user's workouts)
│       ├── GET /:id (single workout)
│       └── DELETE /:id
```

### Controller Layer

```
exerciseController.js (9 Functions)
│
├─► getExercises()
│   ├── Query: muscleGroup, difficulty
│   └── Returns: All matching exercises
│
├─► getExercisesByMuscleGroup(muscleGroup)
│   ├── Filter: muscleGroup
│   └── Returns: Exercises for that muscle
│
├─► getExerciseById(id)
│   └── Returns: Single exercise details
│
├─► getMuscleGroups()
│   └── Returns: All muscle groups with counts
│
├─► getExercisesByDifficulty(level)
│   ├── Filter: difficulty (beginner/intermediate/advanced)
│   └── Returns: Matching exercises
│
├─► searchExercises(query)
│   ├── Search: name, description
│   └── Returns: Matching exercises
│
├─► createExercise() [Admin]
│   ├── Validate input
│   └── Create new exercise
│
├─► updateExercise() [Admin]
│   ├── Find exercise
│   └── Update fields
│
└─► deleteExercise() [Admin]
    ├── Find exercise
    └── Remove from database
```

### Database Layer

```
MongoDB (ai_gym database)
│
├── Exercise Collection (21 documents)
│   ├── Index: muscleGroup
│   ├── Index: difficulty
│   └── Index: name (for search)
│
├── User Collection
│   ├── Index: email (unique)
│   └── Password (hashed)
│
└── Workout Collection
    ├── Index: userId
    └── Index: date
```

### Request/Response Flow

```
Client Request
    │
    ▼
Express Route Handler
    │
    ▼
Controller Function
    ├─► Validate Input
    │   └─► If invalid: Return 400 error
    │
    ├─► Query Database via Mongoose
    │   ├─► Success: Continue
    │   └─► Error: Catch & return 500 error
    │
    └─► Format Response
        ├─► Success: { success: true, data: [...] }
        └─► Error: { success: false, message: "..." }
    │
    ▼
Client Receives Response
```

---

## Data Models

### Exercise Schema

```javascript
{
  name: String (required),
  muscleGroup: String (enum: [chest, back, biceps, triceps, legs, abs, cardio]),
  difficulty: String (enum: [beginner, intermediate, advanced]),
  description: String (required),
  instructions: [{
    order: Number,
    step: String
  }],
  targetReps: Number,
  image: String (URL),
  video: String (URL, optional),
  equipment: [String],
  caloriesBurned: Number,
  createdAt: Date (default: now)
}
```

### Indexes
```
db.exercises.createIndex({ muscleGroup: 1 })
db.exercises.createIndex({ difficulty: 1 })
db.exercises.createIndex({ name: "text", description: "text" })
```

---

## API Query Examples

### Get chest exercises
```
GET http://localhost:5000/api/exercises/group/chest
Response:
{
  success: true,
  count: 4,
  data: [
    {
      _id: "...",
      name: "Push-ups",
      muscleGroup: "chest",
      difficulty: "beginner",
      ...
    },
    ...
  ]
}
```

### Get beginner exercises
```
GET http://localhost:5000/api/exercises/difficulty/beginner
Response: [exercises with difficulty: "beginner"]
```

### Search for pushup variations
```
GET http://localhost:5000/api/exercises/search/pushup
Response: [Push-ups, Incline Push-ups, etc.]
```

### Get all muscle groups
```
GET http://localhost:5000/api/exercises/groups/list/all
Response:
{
  success: true,
  data: [
    { group: "chest", count: 4 },
    { group: "back", count: 4 },
    ...
  ]
}
```

---

## Authentication Flow

```
User Registration
    │
    ├─► POST /api/auth/register
    ├─► Hash password (bcrypt)
    ├─► Create user in MongoDB
    └─► Return success/error

User Login
    │
    ├─► POST /api/auth/login
    ├─► Find user by email
    ├─► Compare password (bcrypt)
    ├─► Generate JWT token
    └─► Return token to client

Protected Request
    │
    ├─► Include token in Authorization header
    ├─► Backend validates JWT
    ├─► If valid: Continue request
    └─► If invalid: Return 401 Unauthorized
```

---

## Real-Time Workout Processing

```
During Workout (Live)
    │
    ├─► MediaPipe captures video frames
    │   └─► 30 FPS (30 poses per second)
    │
    ├─► Pose Detection
    │   ├─► Detect 33 body landmarks
    │   └─► Calculate joint angles
    │
    ├─► Rep Counter
    │   ├─► Analyze pose sequence
    │   └─► Count completed reps
    │
    ├─► Posture Scorer
    │   ├─► Compare to correct form
    │   └─► Generate 0-100% score
    │
    └─► Voice Feedback (optional)
        ├─► Generate audio message
        └─► Play through speakers
```

---

## Error Handling Strategy

```
All Errors Follow Pattern:
{
  success: false,
  message: "User-friendly error message",
  error: "Technical error details" (dev only)
}

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation)
- 401: Unauthorized (auth)
- 404: Not Found
- 500: Server Error
```

---

## Security Architecture

```
Client Layer
    │
    ├─► HTTPS/SSL Encryption
    ├─► JWT Tokens (localStorage)
    └─► No password exposure

API Layer
    │
    ├─► CORS Whitelist
    ├─► Rate Limiting (optional)
    ├─► Input Validation
    └─► SQL Injection Prevention

Database Layer
    │
    ├─► Mongoose Schema Validation
    ├─► Password Hashing (bcrypt)
    ├─► Connection Encryption
    └─► User Isolation (userId filters)
```

---

## Scalability Considerations

### Database Optimization
- ✅ Indexes on frequently queried fields
- ✅ Mongoose connection pooling
- ✅ Aggregation pipelines for complex queries
- ✅ Pagination for large result sets

### API Optimization
- ✅ Request compression
- ✅ Response caching
- ✅ CDN for static assets
- ✅ Load balancing ready

### Frontend Optimization
- ✅ Code splitting
- ✅ Lazy loading components
- ✅ Memoization with React.memo
- ✅ Image optimization

---

## Deployment Architecture

### Development
```
Local Machine
├── Port 3000: React Dev Server
├── Port 5000: Express Server
└── mongodb://localhost:27017: Local MongoDB
```

### Production
```
Cloud Deployment
├── Frontend: Vercel / Netlify
│   └── Serve React build
│
├── Backend: Heroku / AWS / Railway
│   └── Node.js server
│
└── Database: MongoDB Atlas
    └── Cloud-hosted MongoDB
```

---

## Key Architectural Decisions

1. **Database-Driven Exercises**
   - Allows scalability
   - Easy to add/remove exercises
   - Supports future admin panel

2. **Custom React Hooks**
   - Separation of concerns
   - Reusable logic
   - Easy testing

3. **RESTful API**
   - Standard HTTP methods
   - Easy to understand
   - Compatible with tools

4. **MediaPipe Integration**
   - Lightweight (runs in browser)
   - Real-time performance
   - No server-side processing needed

5. **JWT Authentication**
   - Stateless (scalable)
   - Secure token-based
   - Works with SPA architecture

---

## Future Enhancement Paths

### Short Term
- [ ] Admin panel for exercise management
- [ ] Exercise video playback
- [ ] Advanced filtering
- [ ] Leaderboards

### Medium Term
- [ ] Mobile app (React Native)
- [ ] WebSocket for real-time multiplayer
- [ ] Machine learning model optimization
- [ ] Payment integration

### Long Term
- [ ] Social features (friends, challenges)
- [ ] Personalized AI recommendations
- [ ] Wearable device integration
- [ ] Advanced analytics dashboards

---

**Architecture designed for scalability, maintainability, and user experience** 🚀
