# 🚀 Smart Vitals - FREE Deployment Guide

## 📋 **Overview**
- **Backend**: Deploy to Railway (Free tier)
- **Frontend**: Deploy to Vercel (Free tier)
- **Database**: MongoDB Atlas (Free tier)
- **Image Storage**: Cloudinary (Already configured)

---

## 🔧 **STEP 1: Deploy Backend to Railway**

### 1.1 Prepare Your Code
- ✅ `railway.json` - Created
- ✅ `Procfile` - Created
- ✅ `env.production` - Created
- ✅ Server.js updated with production CORS

### 1.2 Deploy to Railway

1. **Go to [Railway.app](https://railway.app)**
   - Sign up with GitHub
   - Click "New Project"

2. **Deploy from GitHub**
   - Select "Deploy from GitHub repo"
   - Choose your Smart_Vitals repository
   - Set root directory to: `Smart_Vitals/Backend`

3. **Configure Environment Variables**
   - Go to Variables tab
   - Add all variables from `env.production`
   - **IMPORTANT**: Replace placeholder values with real API keys

4. **Deploy**
   - Railway will automatically detect it's a Node.js app
   - Build and deploy will start automatically

5. **Get Your Backend URL**
   - After deployment, copy the generated URL
   - Format: `https://your-app-name.railway.app`

---

## 🌐 **STEP 2: Deploy Frontend to Vercel**

### 2.1 Prepare Your Code
- ✅ `vercel.json` - Created
- ✅ `env.production` - Created

### 2.2 Update API Base URL
Before deploying, update your frontend code to use the production backend URL:

```javascript
// In your API service files, replace:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

### 2.3 Deploy to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
   - Sign up with GitHub
   - Click "New Project"

2. **Import from GitHub**
   - Select your Smart_Vitals repository
   - Set root directory to: `Smart_Vitals/FrontEnd`
   - Framework preset: Vite

3. **Configure Environment Variables**
   - Add `VITE_API_BASE_URL` = your Railway backend URL
   - Add `VITE_CLERK_PUBLISHABLE_KEY` = your Clerk key
   - Add `VITE_CLOUDINARY_CLOUD_NAME` = your Cloudinary cloud name

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

5. **Get Your Frontend URL**
   - After deployment, copy the generated URL
   - Format: `https://your-app-name.vercel.app`

---

## 🔄 **STEP 3: Update CORS in Backend**

After getting your frontend URL, update the CORS configuration in your Railway backend:

1. Go to Railway dashboard
2. Open your backend project
3. Go to Variables tab
4. Add: `FRONTEND_URL=https://your-frontend-url.vercel.app`
5. Redeploy your backend

---

## 🗄️ **STEP 4: Database Setup**

### Option A: Railway MongoDB Plugin (Recommended)
1. In Railway dashboard, click "New"
2. Select "MongoDB"
3. Railway will automatically connect it to your backend
4. Copy the connection string to your environment variables

### Option B: MongoDB Atlas (Free Tier)
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Add to Railway environment variables

---

## 🔑 **STEP 5: Environment Variables Checklist**

### Backend (Railway)
```
NODE_ENV=production
PORT=5000
CONN_STRING=mongodb+srv://...
CLERK_SECRET_KEY=sk_...
GEMINI_API_KEY=...
OPENAI_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SPOONACULAR_API_KEY=...
INFERMEDICA_APP_ID=...
INFERMEDICA_APP_KEY=...
```

### Frontend (Vercel)
```
VITE_API_BASE_URL=https://smartvitals-production.up.railway.app
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_CLOUDINARY_CLOUD_NAME=...
```

---

## 🚨 **Common Issues & Solutions**

### Backend Issues
1. **Build fails**: Check if all dependencies are in `package.json`
2. **Port binding**: Railway sets `PORT` automatically
3. **MongoDB connection**: Ensure connection string is correct

### Frontend Issues
1. **Build fails**: Check Vite configuration
2. **API calls fail**: Verify `VITE_API_BASE_URL` is correct
3. **Routing issues**: Ensure `vercel.json` is properly configured

---

## ✅ **Deployment Checklist**

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS updated with frontend URL
- [ ] Database connected
- [ ] API endpoints tested
- [ ] Frontend can communicate with backend

---

## 🌟 **Benefits of This Setup**

1. **Completely Free**: All services offer generous free tiers
2. **Auto-deploy**: Connect GitHub for automatic deployments
3. **Scalable**: Easy to upgrade to paid plans when needed
4. **Professional**: Custom domains, SSL certificates included
5. **Fast**: Global CDN for frontend, optimized backend hosting

---

## 📞 **Need Help?**

- **Railway**: [Discord Community](https://discord.gg/railway)
- **Vercel**: [Documentation](https://vercel.com/docs)
- **MongoDB Atlas**: [Support](https://docs.atlas.mongodb.com)

---

**Happy Deploying! 🚀**
