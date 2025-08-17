import multer from 'multer';

/**
 * Cloudinary Upload Middleware
 * Configures multer for temporary file storage before uploading to Cloudinary
 */
export const cloudinaryUpload = (options = {}) => {
  const {
    maxFileSize = 5 * 1024 * 1024, // 5MB default
    allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    fieldName = 'image'
  } = options;

  // Configure multer for temporary file storage
  const storage = multer.memoryStorage();
  
  const upload = multer({
    storage,
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter: (req, file, cb) => {
      // Check if file type is allowed
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Only ${allowedMimeTypes.join(', ')} files are allowed`), false);
      }
    }
  });

  // Return the configured multer instance
  return upload.single(fieldName);
};

/**
 * Multiple file upload middleware
 */
export const cloudinaryMultipleUpload = (options = {}) => {
  const {
    maxFileSize = 5 * 1024 * 1024, // 5MB default
    allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    fieldName = 'images',
    maxFiles = 5
  } = options;

  // Configure multer for temporary file storage
  const storage = multer.memoryStorage();
  
  const upload = multer({
    storage,
    limits: {
      fileSize: maxFileSize,
      files: maxFiles
    },
    fileFilter: (req, file, cb) => {
      // Check if file type is allowed
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Only ${allowedMimeTypes.join(', ')} files are allowed`), false);
      }
    }
  });

  // Return the configured multer instance
  return upload.array(fieldName, maxFiles);
};

/**
 * Error handling middleware for upload errors
 */
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        details: 'Maximum file size is 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        details: 'Maximum 5 files allowed'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      // Try to get the field name from the route configuration
      const routePath = req.route?.path;
      let expectedField = 'image'; // default
      
      if (routePath === '/detect') {
        expectedField = 'mealImage';
      }
      
      return res.status(400).json({
        error: 'Unexpected field',
        details: `Field name should be "${expectedField}"`,
        help: `Make sure your form uses the field name "${expectedField}"`
      });
    }
  }
  
  if (error.message.includes('Only')) {
    return res.status(400).json({
      error: 'Invalid file type',
      details: error.message
    });
  }
  
  next(error);
};
