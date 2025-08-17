# Cloudinary Setup Guide for Smart Vitals

This guide explains how to set up Cloudinary for cloud-based image storage instead of local file storage using multer.

## 🚀 Why Cloudinary?

- **Cloud Storage**: Images are stored in the cloud, not on your server
- **Deployment Ready**: Works seamlessly when deploying to platforms like Heroku, Vercel, or AWS
- **Image Optimization**: Automatic resizing, compression, and format optimization
- **CDN**: Global content delivery network for fast image loading
- **Scalability**: No server storage limitations
- **Security**: Secure URLs and access control

## 📋 Prerequisites

1. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com)
2. **Node.js Project**: Ensure you have a Node.js project with the required dependencies

## 🔧 Installation

### 1. Install Dependencies

The Cloudinary package is already included in your `package.json`:

```bash
npm install cloudinary
```

### 2. Environment Variables

Add these variables to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Get Your Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. Go to **Dashboard** → **Account Details**
3. Copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 🏗️ Project Structure

```
Backend/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── middleware/
│   └── cloudinaryUpload.js    # Upload middleware
├── utils/
│   └── cloudinaryUtils.js     # Utility functions
├── controllers/
│   └── mealController.js      # Updated to use Cloudinary
└── routes/
    └── mealRoutes.js          # Updated routes
```

## 🔄 Migration from Multer Local Storage

### Before (Local Storage)
```javascript
// Old multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});
```

### After (Cloudinary)
```javascript
// New Cloudinary configuration
const storage = multer.memoryStorage(); // Temporary storage
// File is uploaded to Cloudinary after processing
```

## 📤 How It Works

1. **File Upload**: User uploads image via form
2. **Temporary Storage**: Multer stores file in memory (buffer)
3. **Cloudinary Upload**: File buffer is converted and uploaded to Cloudinary
4. **URL Return**: Cloudinary returns secure URL and public ID
5. **Database Storage**: URL and public ID are saved to database
6. **Cleanup**: Temporary buffer is automatically cleared

## 🎯 Key Features

### Image Optimization
- Automatic resizing (800x800 max)
- Quality optimization
- Format conversion if needed
- Folder organization (`smart-vitals/meals`)

### Error Handling
- File size validation (5MB max)
- File type validation (JPEG, PNG, WebP, GIF)
- Upload error handling
- Graceful fallbacks

### Security
- Secure HTTPS URLs
- Public ID management
- Access control through Cloudinary settings

## 🔌 Usage Examples

### Single Image Upload
```javascript
import { cloudinaryUpload } from '../middleware/cloudinaryUpload.js';

router.post('/upload', cloudinaryUpload(), (req, res) => {
  // req.file.buffer contains the image
  // Process and upload to Cloudinary
});
```

### Multiple Image Upload
```javascript
import { cloudinaryMultipleUpload } from '../middleware/cloudinaryUpload.js';

router.post('/upload-multiple', cloudinaryMultipleUpload(), (req, res) => {
  // req.files array contains multiple images
});
```

### Custom Configuration
```javascript
router.post('/upload', cloudinaryUpload({
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['image/jpeg', 'image/png'],
  fieldName: 'photo'
}), (req, res) => {
  // Custom upload configuration
});
```

## 🗑️ Image Management

### Delete Images
```javascript
import { deleteImage } from '../utils/cloudinaryUtils.js';

// Delete image from Cloudinary
await deleteImage(publicId);
```

### Get Optimized URLs
```javascript
import { getOptimizedImageUrl } from '../utils/cloudinaryUtils.js';

// Get optimized image URL
const optimizedUrl = getOptimizedImageUrl(publicId, {
  width: 400,
  height: 400,
  crop: 'fill'
});
```

## 🚀 Deployment Benefits

### Heroku
- No ephemeral filesystem issues
- Automatic image cleanup
- Scalable storage

### Vercel
- Serverless function compatibility
- No local storage limitations
- Global CDN

### AWS/GCP
- Reduced server storage costs
- Better performance
- Managed service

## 📊 Performance Optimization

### Image Transformations
```javascript
// Automatic optimization
const result = await cloudinary.uploader.upload(dataURI, {
  transformation: [
    { width: 800, height: 800, crop: 'limit' },
    { quality: 'auto:good' }
  ]
});
```

### Lazy Loading
```javascript
// Generate different sizes for different use cases
const thumbnailUrl = getOptimizedImageUrl(publicId, { width: 150, height: 150 });
const fullSizeUrl = getOptimizedImageUrl(publicId, { width: 800, height: 800 });
```

## 🔒 Security Considerations

1. **API Key Protection**: Never expose API secret in client-side code
2. **Upload Restrictions**: Validate file types and sizes
3. **Access Control**: Use Cloudinary's access control features
4. **URL Signing**: Sign URLs for time-limited access if needed

## 🧪 Testing

### Test Upload
```bash
curl -X POST \
  -F "image=@test-image.jpg" \
  http://localhost:5000/api/meals/detect
```

### Test Configuration
```javascript
// Test Cloudinary connection
import cloudinary from '../config/cloudinary.js';

cloudinary.api.ping()
  .then(result => console.log('Cloudinary connected:', result))
  .catch(error => console.error('Cloudinary error:', error));
```

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid API Key"**
   - Check environment variables
   - Verify Cloudinary credentials

2. **"File too large"**
   - Check file size limits
   - Adjust `maxFileSize` in middleware

3. **"Invalid file type"**
   - Check allowed MIME types
   - Verify file extension

4. **Upload failures**
   - Check internet connection
   - Verify Cloudinary service status
   - Check API rate limits

### Debug Mode
```javascript
// Enable Cloudinary debug mode
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  debug: true // Enable debug logging
});
```

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK Reference](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Upload API Reference](https://cloudinary.com/documentation/upload_images)

## 🎉 Next Steps

1. **Test the setup** with sample images
2. **Monitor usage** in Cloudinary dashboard
3. **Optimize images** based on your needs
4. **Set up monitoring** for upload success rates
5. **Implement cleanup** for unused images

Your Smart Vitals project is now ready for cloud deployment with professional-grade image management! 🚀

