# 🚀 Smart Vitals - Production Configuration

## 🌐 **Your Deployed URLs**

### ✅ **Backend (Railway)**
- **URL**: [https://smartvitals-production.up.railway.app](https://smartvitals-production.up.railway.app)
- **Status**: ✅ Deployed and Running
- **Health Check**: [https://smartvitals-production.up.railway.app/health](https://smartvitals-production.up.railway.app/health)

### ✅ **Frontend (Vercel)**
- **URL**: [https://smart-vitals.vercel.app](https://smart-vitals.vercel.app)
- **Status**: ✅ Deployed and Running
- **Framework**: React + Vite

---

## 🔧 **Required Configuration**

### **Backend Environment Variables (Railway)**
```
NODE_ENV=production
PORT=5000
CONN_STRING=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SPOONACULAR_API_KEY=your_spoonacular_api_key
INFERMEDICA_APP_ID=your_infermedica_app_id
INFERMEDICA_APP_KEY=your_infermedica_app_key
FRONTEND_URL=https://smart-vitals.vercel.app
```

### **Frontend Environment Variables (Vercel)**
```
VITE_API_BASE_URL=https://smartvitals-production.up.railway.app
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

---

## 🔄 **CORS Configuration**

Your backend is now configured to accept requests from:
- `http://localhost:5173` (Development)
- `http://localhost:5174` (Development)
- `https://smart-vitals.vercel.app` (Production)
- Dynamic URL from `FRONTEND_URL` environment variable

---

## 🗄️ **Database Setup**

### **Option A: Railway MongoDB Plugin (Recommended)**
1. In Railway dashboard, click "New"
2. Select "MongoDB"
3. Railway will automatically connect it to your backend
4. Copy the connection string to `CONN_STRING`

### **Option B: MongoDB Atlas (Free Tier)**
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Add to `CONN_STRING` variable

---

## 🧪 **Testing Your Deployment**

### **Backend Health Check**
```bash
curl https://smartvitals-production.up.railway.app/health
```

### **Frontend-Backend Communication**
1. Visit [https://smart-vitals.vercel.app](https://smart-vitals.vercel.app)
2. Sign up/Login with Clerk
3. Test all features (water tracking, sleep tracking, etc.)
4. Verify API calls work with production backend

---

## 🚨 **Troubleshooting**

### **If Frontend Can't Connect to Backend:**
1. Check Railway backend is running
2. Verify `FRONTEND_URL` is set in Railway
3. Check CORS configuration in server.js
4. Ensure all environment variables are set

### **If Build Fails:**
1. Check Vercel build logs
2. Verify all dependencies are in package.json
3. Check environment variables are correctly set

---

## 🎉 **You're All Set!**

Your Smart Vitals application is now:
- ✅ **Backend**: Running on Railway
- ✅ **Frontend**: Running on Vercel
- ✅ **CORS**: Configured for production
- ✅ **Environment**: Production-ready

**Next Steps:**
1. Set up your database (MongoDB)
2. Configure all API keys in Railway
3. Test your application end-to-end
4. Share your app with the world! 🌍

---

**Your App is Live at: [https://smart-vitals.vercel.app](https://smart-vitals.vercel.app)**
