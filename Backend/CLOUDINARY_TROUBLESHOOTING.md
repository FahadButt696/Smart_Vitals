# Cloudinary Upload Troubleshooting Guide

## 🚨 Common Errors and Solutions

### 1. "options is not defined" Error

**Error Message:**
```
ReferenceError: options is not defined
    at handleUploadError (file:///path/to/cloudinaryUpload.js:90:43)
```

**Cause:** The error handling middleware was trying to access undefined `options` variable.

**Solution:** ✅ **FIXED** - Updated the middleware to use hardcoded values instead of undefined options.

### 2. Route Order Conflicts

**Problem:** Routes like `/:id` catching requests meant for `/food/:foodId`.

**Solution:** ✅ **FIXED** - Reordered routes to put specific routes before parameterized ones.

**Correct Order:**
```javascript
router.get("/search/:query", searchFoods);
router.get("/food/:foodId", getMealByFoodId);
router.get("/:id", getMealById); // This comes last
```

### 3. Environment Variables Missing

**Error:** Cloudinary connection fails with "Invalid API key" or "Invalid signature".

**Solution:**
1. Check your `.env` file has these variables:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

2. Verify credentials in Cloudinary dashboard
3. Restart your server after updating `.env`

### 4. File Upload Issues

**Error:** "No image uploaded" or "File too large"

**Solutions:**
- Ensure form field name is `image` (default)
- Check file size is under 5MB
- Verify file type is: JPEG, PNG, WebP, or GIF
- Use `multipart/form-data` encoding

### 5. Multer Configuration Issues

**Error:** Multer-related errors

**Solution:** The middleware is now properly configured with:
- Memory storage (no local files)
- 5MB file size limit
- Image type validation
- Proper error handling

## 🧪 Testing Your Setup

### 1. Test Cloudinary Connection
```bash
npm run test-cloudinary
```

### 2. Test Image Upload
```bash
curl -X POST \
  -F "image=@test-image.jpg" \
  http://localhost:5000/api/meals/detect
```

### 3. Check Server Logs
Look for:
- ✅ "Cloudinary connected successfully"
- ✅ "Image uploaded to Cloudinary"
- ❌ Any error messages

## 🔧 Quick Fixes

### If Upload Still Fails:

1. **Restart Server:**
   ```bash
   npm run dev
   ```

2. **Check Environment Variables:**
   ```bash
   echo $CLOUDINARY_CLOUD_NAME
   echo $CLOUDINARY_API_KEY
   echo $CLOUDINARY_API_SECRET
   ```

3. **Verify Cloudinary Account:**
   - Log into [cloudinary.com](https://cloudinary.com)
   - Check Dashboard → Account Details
   - Verify API credentials

4. **Test with Simple Image:**
   - Use a small JPEG file (< 1MB)
   - Ensure it's a valid image file

## 📱 Frontend Integration

### Form Setup:
```html
<form enctype="multipart/form-data">
  <input type="file" name="image" accept="image/*" />
  <button type="submit">Upload</button>
</form>
```

### JavaScript:
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('/api/meals/detect', {
  method: 'POST',
  body: formData
});
```

## 🚀 Deployment Checklist

Before deploying, ensure:
- ✅ Environment variables are set in production
- ✅ Cloudinary account is active
- ✅ File upload limits are appropriate
- ✅ Error handling is robust
- ✅ Routes are properly ordered

## 📞 Still Having Issues?

1. **Check the test script output:**
   ```bash
   npm run test-cloudinary
   ```

2. **Verify your `.env` file:**
   ```bash
   cat .env | grep CLOUDINARY
   ```

3. **Test Cloudinary directly:**
   ```javascript
   import cloudinary from './config/cloudinary.js';
   cloudinary.api.ping().then(console.log).catch(console.error);
   ```

4. **Check server logs** for detailed error messages

Your Cloudinary setup should now work correctly! 🎉

