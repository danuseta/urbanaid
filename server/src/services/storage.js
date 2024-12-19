const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
const fs = require('fs');
const unlinkAsync = promisify(fs.unlink);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const StorageService = {
  async uploadFile(file) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'reports',
        use_filename: true,
        unique_filename: true,
        overwrite: true,
      });

      await unlinkAsync(file.path);

      return result.secure_url;
    } catch (error) {
      if (file.path) {
        await unlinkAsync(file.path).catch(console.error);
      }
      throw error;
    }
  },

  async deleteFile(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      throw error;
    }
  }
};

module.exports = StorageService;