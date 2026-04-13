# 🚀 Complete Setup Guide

## Prerequisites
- **Node.js** v14 or higher - [Download](https://nodejs.org/)
- **MongoDB** - [Install locally](https://docs.mongodb.com/manual/installation/) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** - Comes with Node.js

## Step-by-Step Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/TejasTambe8080/AI-Smart-Gym.git
cd AI_BASED_SMART_GYM
```

### 2️⃣ Setup Backend Server

#### Install Dependencies
```bash
cd server
npm install
```

#### Configure Environment Variables

Copy the example file and update with your configuration:

```bash
cp .env.example .env
```

Edit `server/.env`:
```env
# If using local MongoDB (default)
MONGODB_URI=mongodb://localhost:27017/ai_gym

# OR MongoDB Atlas (if not using local)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai_gym

JWT_SECRET=your_secret_key_change_in_production
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

#### Seed Database with Exercises

This populates MongoDB with 21 real exercises:

```bash
# Make sure MongoDB is running first
node seed.js
```

Expected output:
```
✅ Connected to MongoDB!
✅ Seeded 21 exercises successfully!

📊 Exercise Summary:
  🫀 Chest: 4 exercises
  🔙 Back: 4 exercises
  💪 Biceps: 3 exercises
  💪 Triceps: 3 exercises
  🦵 Legs: 3 exercises
  🫶 Abs: 3 exercises
  💨 Cardio: 2 exercises
```

#### Start Backend Server
```bash
npm start
```

Expected output:
```
Server running on http://localhost:5000
MongoDB connected successfully
```

### 3️⃣ Setup Frontend Client

Open a **new terminal** and navigate to the client directory:

#### Install Dependencies
```bash
cd client
npm install
```

#### Start Development Server
```bash
npm start
```

The application will automatically open at `http://localhost:3000`

---

## ⚙️ MongoDB Setup

### Option A: Local MongoDB (Recommended for Development)

#### Windows
```bash
# Download and install MongoDB Community Edition
# https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

# Or using Chocolatey:
choco install mongodb-community

# Start MongoDB service
net start MongoDB
```

#### Mac
```bash
# Using Homebrew:
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB:
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Option B: MongoDB Atlas (Cloud-Based)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/ai_gym`
5. Update `MONGODB_URI` in `.env`

---

## 🧪 Testing the API

### Test Exercise Endpoints

You can use **Postman**, **Insomnia**, or **curl**. Here are some endpoints to test:

#### 1. Get All Muscle Groups
```bash
curl http://localhost:5000/api/exercises/groups/list/all
```

Response:
```json
{
  "success": true,
  "data": [
    { "group": "chest", "count": 4 },
    { "group": "back", "count": 4 },
    { "group": "biceps", "count": 3 },
    { "group": "triceps", "count": 3 },
    { "group": "legs", "count": 3 },
    { "group": "abs", "count": 3 },
    { "group": "cardio", "count": 2 }
  ]
}
```

#### 2. Get Chest Exercises
```bash
curl http://localhost:5000/api/exercises/group/chest
```

#### 3. Search Exercises
```bash
curl http://localhost:5000/api/exercises/search/pushup
```

#### 4. Filter by Difficulty
```bash
curl http://localhost:5000/api/exercises/difficulty/beginner
```

---

## 📱 Using the Application

### 1. Create Account
- Go to **Signup** page
- Enter email and password
- Click **Sign Up**

### 2. Navigate Workout Page
- Click **Workout** in navigation
- **Step 1**: Select muscle group (Chest, Back, Biceps, etc.)
- **Step 2**: Select exercise (dynamically loaded from database)
- **Step 3**: View exercise details and form instructions
- **Step 4**: Start workout with pose detection
- **Step 5**: See results and AI suggestions

### 3. View Analytics
- Check **Dashboard** for overview
- **Analytics** page shows detailed performance metrics
- **Activity** tracks workout history

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (Frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh  # or 'mongo' for older versions

# If not running, restart:
# Windows: net start MongoDB
# Mac: brew services restart mongodb-community
# Linux: sudo systemctl restart mongodb
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 Already in Use (React)
The development server will ask to use a different port. Accept the prompt.

---

## 📊 Database Reset

To clear all data and reseed exercises:

```bash
cd server

# Drop database (be careful!)
mongosh  # Connect to MongoDB
# use ai_gym
# db.dropDatabase()

# Reseed exercises
node seed.js
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Enable MongoDB authentication
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Configure proper CORS settings
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB connection encryption

---

## 📦 Production Deployment

### Deploy Backend to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB Atlas URI
heroku config:set MONGODB_URI=mongodb+srv://...

# Deploy
git push heroku main
```

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# In Vercel dashboard, set API URL to Heroku app
```

---

## 📚 Project File Guide

```
AI_BASED_SMART_GYM/
├── server/
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Exercise.js          # Exercise schema (DB-driven)
│   │   └── Workout.js           # Workout history
│   ├── controllers/
│   │   ├── exerciseController.js    # 9 API endpoints
│   │   ├── authController.js
│   │   └── workoutController.js
│   ├── routes/
│   │   ├── exerciseRoutes.js        # /api/exercises/*
│   │   ├── authRoutes.js
│   │   └── workoutRoutes.js
│   ├── seed.js                  # Populate 21 exercises
│   ├── server.js                # Entry point
│   ├── .env                     # Config (don't commit)
│   └── .env.example             # Config template
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ExerciseCard.js      # Dynamic exercise display
│   │   ├── hooks/
│   │   │   └── useExercises.js      # Fetch from API
│   │   ├── pages/
│   │   │   └── WorkoutRefactored.js # 5-step workflow
│   │   └── services/
│   │       └── api.js               # API client
│   └── package.json
│
└── README.md                     # Project overview
```

---

## 🎯 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | All exercises (with filters) |
| GET | `/api/exercises/group/:muscleGroup` | Get by muscle |
| GET | `/api/exercises/groups/list/all` | All muscle groups |
| GET | `/api/exercises/:id` | Single exercise |
| GET | `/api/exercises/difficulty/:level` | By difficulty |
| GET | `/api/exercises/search/:query` | Search exercises |

---

## 💡 Tips

- **Use Insomnia or Postman** to test API endpoints during development
- **Check browser DevTools (Network tab)** to see API calls
- **Run `npm install` first** before running any node commands
- **Keep `.env` file local** - never commit it to GitHub
- **Use `.env.example`** to document required variables

---

## 🆘 Need Help?

- Check existing [GitHub Issues](https://github.com/TejasTambe8080/AI-Smart-Gym/issues)
- Create a new issue with details
- Contact: tejastavbe@example.com

---

**Happy Coding! 🚀**
