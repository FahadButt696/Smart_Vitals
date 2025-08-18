# 🔥 Calorie Tracker - Smart Vitals

## Overview
The Calorie Tracker is a comprehensive nutrition and fitness monitoring system that provides detailed insights into your daily calorie intake, workout calories burned, and nutrition balance. It features interactive charts, AI-powered recommendations, and personalized goal tracking.

## ✨ Features

### 📊 **Multi-Period Tracking**
- **Daily View**: Last 7 days with detailed daily breakdown
- **Weekly View**: Last 4 weeks with weekly averages
- **Monthly View**: Last 6 months with monthly trends

### 🎯 **Smart Goal Management**
- **BMR Calculation**: Uses Harris-Benedict equation for accurate calorie needs
- **Activity Level Adjustment**: Sedentary to very active multipliers
- **Goal-Based Adjustments**: Weight loss (-500 cal), maintenance, or weight gain (+300 cal)
- **Macro Distribution**: Automatic protein, carbs, and fat recommendations

### 📈 **Interactive Charts**
- **Calorie Trends**: Bar charts showing consumed vs. target calories
- **Nutrition Distribution**: Doughnut charts for macro breakdown
- **Progress Tracking**: Visual progress bars with color-coded status
- **Responsive Design**: Optimized for all screen sizes

### 🧠 **AI-Powered Insights**
- **Nutrition Analysis**: Personalized recommendations based on your data
- **Workout Balance**: Suggestions for optimal exercise frequency
- **Meal Optimization**: Tips for better nutrition balance
- **Progress Recognition**: Positive reinforcement for good habits

### 🍽️ **Meal Integration**
- **Real-time Sync**: Automatically pulls from your meal logger
- **Nutrition Breakdown**: Protein, carbs, fat, fiber, and sugar tracking
- **Meal History**: View today's meals with calorie counts
- **Smart Calculations**: Automatic serving size and quantity adjustments

## 🚀 Getting Started

### 1. **Access the Calorie Tracker**
- Navigate to your Dashboard
- Click on "Calorie Tracker" in the sidebar
- The page will automatically load your current data

### 2. **Set Your Goals**
- **Age, Gender, Weight, Height**: Basic biometrics for BMR calculation
- **Activity Level**: Choose from sedentary to very active
- **Goal**: Select weight loss, maintenance, or weight gain
- **Target Calories**: Automatically calculated based on your profile

### 3. **Track Your Progress**
- **Daily Logging**: Log meals through the Meal Logger
- **Workout Tracking**: Complete workouts to track calories burned
- **Monitor Trends**: Use the time period selector to view different ranges

## 📱 User Interface

### **Main Dashboard**
```
┌─────────────────────────────────────────────────────────────┐
│                    🔥 Calorie Tracker                      │
│                                                             │
│  [Daily] [Weekly] [Monthly]                                │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │   Today's       │  │   Your Goals     │                 │
│  │   Progress      │  │                 │                 │
│  │                 │  │  Target: 2000   │                 │
│  │  [Progress Bar] │  │  Protein: 150g  │                 │
│  │                 │  │  Carbs: 225g    │                 │
│  └─────────────────┘  │  Fat: 67g      │                 │
│                       └─────────────────┘                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Calorie Trends Chart                       │ │
│  │                                                         │ │
│  │  [Interactive Bar Chart]                                │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │   Nutrition     │  │   Today's       │                 │
│  │   Distribution  │  │   Meals         │                 │
│  │                 │  │                 │                 │
│  │  [Doughnut]     │  │  ☕ Breakfast    │                 │
│  │                 │  │  🍔 Lunch       │                 │
│  └─────────────────┘  │  🍕 Dinner      │                 │
│                       └─────────────────┘                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              AI Insights & Recommendations              │ │
│  │                                                         │ │
│  │  💡 Personalized tips and suggestions                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### **Sidebar Navigation**
- **Dashboard**: Overview of all health metrics
- **Calorie Tracker**: This feature (with 🔥 icon)
- **Meals**: Log and track your food intake
- **Workouts**: Track exercise and calories burned
- **Other Trackers**: Water, sleep, weight, etc.

## 🔧 Technical Implementation

### **Frontend Components**
- `CalorieTracker.jsx`: Main page component
- `ChartComponents.jsx`: Reusable chart components
- `AIRecommendationCard.jsx`: AI insights display
- `useAIRecommendations.js`: Hook for AI data

### **Backend API**
- `calorieController.js`: Core calorie logic
- `calorieRoutes.js`: API endpoints
- Integration with existing Meal and Workout models

### **API Endpoints**
```
GET  /api/calories?userId={id}&period={daily|weekly|monthly}
GET  /api/calories/goals?userId={id}
PUT  /api/calories/goals
GET  /api/calories/insights?userId={id}
```

### **Data Models**
- **Meal Model**: Stores nutrition data with normalized fields
- **Workout Model**: Tracks calories burned and exercise data
- **User Profile**: Biometrics and goal settings

## 📊 Data Flow

### **1. Data Collection**
```
User Input → Meal Logger → Database → Calorie Tracker
     ↓
Workout Logger → Calories Burned → Database → Calorie Tracker
```

### **2. Processing Pipeline**
```
Raw Data → Normalization → Aggregation → Chart Generation → Display
```

### **3. Real-time Updates**
- **Automatic Refresh**: Data updates when meals/workouts are logged
- **Manual Refresh**: Refresh button for immediate updates
- **Period Switching**: Instant chart updates for different time ranges

## 🎨 Customization Options

### **Chart Themes**
- **Color Schemes**: Customizable chart colors
- **Chart Types**: Bar, line, doughnut, and progress charts
- **Responsive Layout**: Adapts to different screen sizes

### **Goal Adjustments**
- **Dynamic Targets**: Real-time calorie goal updates
- **Macro Ratios**: Customizable protein/carb/fat distribution
- **Activity Levels**: Adjustable based on lifestyle changes

## 🔍 Troubleshooting

### **Common Issues**

#### **Nutrition Data Not Showing**
- Check if meals are properly logged
- Verify nutrition field names in database
- Use the refresh button to reload data

#### **Charts Not Displaying**
- Ensure Chart.js dependencies are installed
- Check browser console for JavaScript errors
- Verify data format matches expected structure

#### **API Connection Issues**
- Check backend server is running
- Verify API endpoints are accessible
- Check network connectivity

### **Debug Mode**
- **Console Logs**: Extensive logging for troubleshooting
- **Data Validation**: Automatic data format checking
- **Error Boundaries**: Graceful error handling

## 🚀 Future Enhancements

### **Planned Features**
- **Food Database Integration**: Comprehensive nutrition database
- **Barcode Scanner**: Quick food logging
- **Social Features**: Share progress with friends
- **Mobile App**: Native mobile experience
- **Wearable Integration**: Sync with fitness trackers

### **Advanced Analytics**
- **Predictive Insights**: AI-powered trend predictions
- **Nutrition Scoring**: Overall diet quality assessment
- **Goal Achievement**: Progress tracking and milestones
- **Custom Reports**: Personalized health reports

## 📚 API Documentation

### **Calorie Data Response**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15",
      "consumed": 1850,
      "burned": 320,
      "net": 1530,
      "mealCount": 3,
      "workoutCount": 1
    }
  ],
  "period": "daily",
  "summary": {
    "totalConsumed": 12950,
    "totalBurned": 2240,
    "totalMeals": 21,
    "totalWorkouts": 7
  }
}
```

### **Goals Response**
```json
{
  "success": true,
  "goals": {
    "dailyCalories": 2000,
    "protein": 150,
    "carbs": 225,
    "fat": 67,
    "fiber": 25,
    "sugar": 50
  }
}
```

## 🤝 Contributing

### **Development Setup**
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the development server: `npm run dev`

### **Code Standards**
- **ESLint**: Follow project linting rules
- **Component Structure**: Use functional components with hooks
- **Error Handling**: Implement proper error boundaries
- **Testing**: Write unit tests for new features

## 📄 License

This project is part of Smart Vitals and follows the same licensing terms.

## 🆘 Support

For technical support or feature requests:
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this README and API docs
- **Community**: Join our developer community

---

**🔥 Happy Calorie Tracking!** 

*Track your nutrition, achieve your goals, and build a healthier lifestyle with Smart Vitals.*


