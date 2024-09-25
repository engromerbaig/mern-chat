import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload file buffer to Cloudinary
export const uploadOnCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto' }, // Auto-detect the type (audio, image, video, etc.)
      (error, result) => {
        if (error) {
          return reject(error); // Reject promise if there is an error
        }
        resolve(result.secure_url); // Return Cloudinary URL if successful
      }
    ).end(fileBuffer); // Pass the file buffer to the upload stream
  });
};
