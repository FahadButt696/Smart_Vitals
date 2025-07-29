# Smart Vitals Backend API

A comprehensive health and fitness tracking API built with Node.js, Express, and MongoDB.

##  Features

- **User Management**: Clerk authentication integration
- **Workout Tracking**: Log exercises, sets, reps, and progress
- **Nutrition Tracking**: Meal logging with AI-powered calorie detection
- **Weight Management**: Track weight, BMI, and body composition
- **Water Intake**: Monitor daily hydration goals
- **Sleep Tracking**: Analyze sleep patterns and quality
- **Diet Planning**: AI-generated personalized meal plans
- **Symptom Checking**: AI-powered health symptom analysis
- **Mental Health**: Mood tracking and AI support
- **Health Reports**: Generate comprehensive PDF reports
- **Data Visualization**: Charts and analytics

##  Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Clerk account for authentication
- OpenAI API key (for AI features)
- Cloudinary account (for image uploads)

##  Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smart_Vitals/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Fill in your environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/smart_vitals
   CLERK_SECRET_KEY=your_clerk_secret_key
   OPENAI_API_KEY=your_openai_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📁 Project Structure

```
Backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   ├── auth.js              # Clerk authentication
│   ├── errorHandler.js      # Error handling
│   └── notFound.js          # 404 handler
├── models/
│   ├── User.js              # User profile
│   ├── Workout.js           # Workout logs
│   ├── Meal.js              # Meal tracking
│   ├── CalorieGoal.js       # Calorie goals
│   ├── WeightLog.js         # Weight tracking
│   ├── WaterIntake.js       # Water intake
│   ├── SleepLog.js          # Sleep tracking
│   ├── DietPlan.js          # Diet plans
│   ├── SymptomLog.js        # Symptom tracking
│   ├── MentalHealthLog.js   # Mental health
│   └── HealthReport.js      # Health reports
├── routes/
│   ├── auth.js              # Authentication
│   ├── users.js             # User management
│   ├── workouts.js          # Workout CRUD
│   ├── meals.js             # Meal CRUD
│   ├── calories.js          # Calorie goals
│   ├── weight.js            # Weight tracking
│   ├── water.js             # Water intake
│   ├── sleep.js             # Sleep tracking
│   ├── diet.js              # Diet plans
│   ├── symptoms.js          # Symptom tracking
│   ├── mentalHealth.js      # Mental health
│   └── reports.js           # Health reports
├── uploads/                 # File uploads
├── server.js               # Main server file
├── package.json            # Dependencies
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/profile` - Create/update user profile

### Users
- `GET /api/users/:id` - Get user by ID

### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout

### Meals
- `GET /api/meals` - Get all meals
- `POST /api/meals` - Create meal

### Calories
- `GET /api/calories` - Get calorie goals
- `POST /api/calories` - Create calorie goal

### Weight
- `GET /api/weight` - Get weight logs
- `POST /api/weight` - Create weight log

### Water
- `GET /api/water` - Get water intake
- `POST /api/water` - Create water intake

### Sleep
- `GET /api/sleep` - Get sleep logs
- `POST /api/sleep` - Create sleep log

### Diet Plans
- `GET /api/diet` - Get diet plans
- `POST /api/diet` - Create diet plan

### Symptoms
- `GET /api/symptoms` - Get symptom logs
- `POST /api/symptoms` - Create symptom log

### Mental Health
- `GET /api/mental-health` - Get mental health logs
- `POST /api/mental-health` - Create mental health log

### Reports
- `GET /api/reports` - Get health reports
- `POST /api/reports` - Create health report

## 🔐 Authentication

The API uses Clerk for authentication. Include the Clerk session token in the Authorization header:

```
Authorization: Bearer <clerk_session_token>
```

## 📊 Database Models

### User
- Profile information
- Health preferences
- Fitness goals
- Medical conditions

### Workout
- Exercise details
- Sets and reps
- Duration and calories
- Progress tracking

### Meal
- Food items
- Nutritional values
- AI detection results
- Meal types

### WeightLog
- Weight measurements
- Body composition
- BMI calculations
- Progress trends

### SleepLog
- Sleep duration
- Quality metrics
- Sleep cycles
- Environment factors

### MentalHealthLog
- Mood tracking
- Stress levels
- AI support
- Risk assessment

## 🤖 AI Integration

- **Calorie Detection**: Analyze food images
- **Symptom Analysis**: Provide health insights
- **Diet Planning**: Generate personalized meal plans
- **Mental Health Support**: AI-powered guidance

## 📈 Data Analytics

- Progress tracking
- Trend analysis
- Health scoring
- Goal monitoring
- PDF report generation

## 🚀 Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Use MongoDB Atlas for production
3. **File Storage**: Configure Cloudinary for image uploads
4. **Security**: Enable rate limiting and CORS
5. **Monitoring**: Set up logging and error tracking

## 🔧 Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team. 