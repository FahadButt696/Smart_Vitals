# Infermedica AI Symptom Checker Setup Guide

This guide will help you set up the AI-powered symptom checker using Infermedica's medical AI API.

## 🚀 What We've Built

The symptom checker provides:
- **AI-powered symptom analysis** using Infermedica's medical AI
- **Structured symptom parsing** from natural language input
- **Medical condition diagnosis** with probability scores
- **Triage level assessment** (emergency, urgent, non-urgent, self-care)
- **Complete symptom history** for users
- **Professional frontend** with real-time results

## 📋 Prerequisites

1. **Infermedica Account**: Sign up at [https://developer.infermedica.com/](https://developer.infermedica.com/)
2. **Node.js Backend**: Your Smart Vitals backend server
3. **MongoDB Database**: For storing symptom check results
4. **Frontend**: React application for the user interface

## 🔑 Step 1: Get Infermedica API Credentials

1. **Sign Up**: Go to [https://developer.infermedica.com/](https://developer.infermedica.com/) and create an account
2. **Create App**: Create a new application in your dashboard
3. **Get Credentials**: Copy your `App ID` and `App Key`

## ⚙️ Step 2: Configure Environment Variables

1. **Navigate** to your `Smart_Vitals/Backend` folder
2. **Create/Edit** the `.env` file
3. **Add** your Infermedica credentials:

```env
# Infermedica API Configuration
INFERMEDICA_APP_ID=your_app_id_here
INFERMEDICA_APP_KEY=your_app_key_here
```

## 🗄️ Step 3: Database Setup

The system automatically creates the `SymptomCheck` collection with this schema:

```javascript
{
  userId: String,           // User identifier
  symptomsEntered: String,  // Original symptom text
  structuredSymptoms: [     // Parsed symptoms from AI
    {
      id: String,           // Symptom ID from Infermedica
      name: String,         // Symptom name
      choice_id: String     // present/absent/unknown
    }
  ],
  diagnosisResults: [       // AI diagnosis results
    {
      id: String,           // Condition ID
      name: String,         // Condition name
      probability: Number    // Probability score (0-1)
    }
  ],
  triage: {                // Urgency assessment
    level: String,          // emergency/urgent/non_urgent/self_care
    description: String     // Triage explanation
  },
  userDemographics: {       // User information
    age: Number,
    sex: String
  },
  timestamp: Date           // When check was performed
}
```

## 🔧 Step 4: Backend Integration

The backend is already configured with:

- **Routes**: `/api/symptom-check/*`
- **Controller**: `symptomCheckController.js`
- **Model**: `SymptomCheck.js`
- **Server Integration**: Added to `server.js`

### Available Endpoints:

```bash
POST /api/symptom-check/check     # Run new symptom check
GET  /api/symptom-check/          # Get user's symptom history
GET  /api/symptom-check/:id       # Get specific check by ID
DELETE /api/symptom-check/:id     # Delete a symptom check
GET  /api/symptom-check/health    # Test Infermedica API connection
```

## 🎨 Step 5: Frontend Integration

The frontend component (`SymptomChecker.jsx`) provides:

- **User-friendly form** for age, sex, and symptom selection
- **Body part categorization** for easy symptom selection
- **Real-time AI analysis** with loading states
- **Results display** showing triage, conditions, and symptoms
- **History management** with delete functionality
- **Professional UI** with animations and responsive design

## 🧪 Step 6: Testing the Integration

### Test the APIs:

```bash
# Navigate to backend folder
cd Smart_Vitals/Backend

# Run the test script
npm run test-symptom
```

### Test the Frontend:

1. **Start your backend server**: `npm run dev`
2. **Start your frontend**: `npm run dev` (in FrontEnd folder)
3. **Navigate** to the Symptom Checker page
4. **Fill out** the form and submit symptoms
5. **Verify** results are displayed correctly

## 🔍 Step 7: API Flow

Here's how the symptom checker works:

```
1. User Input → Frontend Form
   ↓
2. Backend Validation → Age, Sex, Symptoms
   ↓
3. Infermedica Parse → Extract structured symptoms
   ↓
4. Infermedica Diagnosis → Get conditions & triage
   ↓
5. Database Storage → Save results
   ↓
6. Response → Return structured data to frontend
   ↓
7. Display → Show results with professional UI
```

## 🚨 Troubleshooting

### Common Issues:

1. **"API authentication failed"**
   - Check your `.env` file has correct credentials
   - Verify credentials are valid in Infermedica dashboard

2. **"No symptoms could be identified"**
   - Use more specific symptom descriptions
   - Try common medical terms

3. **"API rate limit exceeded"**
   - Wait a few minutes before trying again
   - Check your Infermedica plan limits

4. **Frontend not connecting to backend**
   - Ensure backend is running on port 5000
   - Check CORS configuration
   - Verify API endpoints are correct

### Debug Commands:

```bash
# Check environment variables
echo $INFERMEDICA_APP_ID
echo $INFERMEDICA_APP_KEY

# Test API connection
curl -X GET "https://api.infermedica.com/v3/info" \
  -H "App-Id: YOUR_APP_ID" \
  -H "App-Key: YOUR_APP_KEY"

# Check backend logs
npm run dev
```

## 📱 Features

### What Users Can Do:

- **Select symptoms** by body area or common symptoms
- **Input demographics** (age, sex) for accurate analysis
- **Get AI diagnosis** with probability scores
- **View triage levels** to understand urgency
- **Track history** of all symptom checks
- **Delete old checks** to manage their data

### AI Capabilities:

- **Natural language processing** of symptom descriptions
- **Medical knowledge base** with thousands of conditions
- **Evidence-based diagnosis** using clinical guidelines
- **Triage assessment** for emergency vs. routine care
- **Multi-symptom analysis** for complex presentations

## 🔒 Security & Privacy

- **No medical data** is stored by Infermedica
- **User data** is stored locally in your MongoDB
- **API calls** are made server-to-server
- **No PII** is transmitted to third parties
- **Compliant** with medical data regulations

## 📈 Scaling Considerations

- **Rate limiting** on API calls
- **Caching** of common symptom patterns
- **Batch processing** for multiple users
- **Database indexing** on userId and timestamp
- **API monitoring** for usage tracking

## 🎯 Next Steps

1. **Customize** the symptom categories for your users
2. **Add** user authentication integration
3. **Implement** notification system for urgent cases
4. **Create** detailed health reports
5. **Add** integration with other health services

## 📞 Support

- **Infermedica Docs**: [https://developer.infermedica.com/docs](https://developer.infermedica.com/docs)
- **API Reference**: [https://developer.infermedica.com/docs/api](https://developer.infermedica.com/docs/api)
- **Community**: [https://community.infermedica.com/](https://community.infermedica.com/)

---

**Note**: This symptom checker is for informational purposes only and should not replace professional medical advice. Always consult healthcare providers for proper diagnosis and treatment.
