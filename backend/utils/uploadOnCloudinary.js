// backend\utils\uploadOnCloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',  // Automatically determine file type (image, video, etc.)
      },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);  // Return the Cloudinary URL on success
        } else {
          reject(error);  // Reject with error message
        }
      }
    );

    stream.end(buffer);  // Send the buffer to Cloudinary
  });
};
