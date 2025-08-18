import cloudinary from '../config/cloudinary.js';

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} mimetype - File mimetype
 * @param {string} folder - Cloudinary folder path
 * @param {Object} options - Additional upload options
 * @returns {Object} Upload result with url, publicId, width, height
 */
export const uploadImage = async (fileBuffer, mimetype, folder = 'smart-vitals', options = {}) => {
  try {
    // Convert buffer to base64 string
    const b64 = Buffer.from(fileBuffer).toString('base64');
    const dataURI = `data:${mimetype};base64,${b64}`;
    
    // Default upload options
    const defaultOptions = {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Resize for optimization
        { quality: 'auto:good' } // Optimize quality
      ]
    };
    
    // Merge with custom options
    const uploadOptions = { ...defaultOptions, ...options };
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, uploadOptions);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to cloud storage');
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Object} Deletion result
 */
export const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error('Public ID is required for deletion');
    }
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new Error('Failed to delete image from cloud storage');
  }
};

/**
 * Get optimized image URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Image transformations
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, transformations = {}) => {
  if (!publicId) return null;
  
  const defaultTransformations = {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto:good'
  };
  
  const finalTransformations = { ...defaultTransformations, ...transformations };
  
  return cloudinary.url(publicId, finalTransformations);
};

/**
 * Clean up orphaned images (optional maintenance function)
 * @param {Array} usedPublicIds - Array of public IDs currently in use
 * @param {string} folder - Folder to clean up
 */
export const cleanupOrphanedImages = async (usedPublicIds, folder = 'smart-vitals') => {
  try {
    // This is a more complex operation that would require listing all images
    // and comparing with used IDs. Implement as needed for maintenance.
    console.log('Cleanup function called - implement as needed');
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};



