import mongoose from "mongoose";
import { validRoles } from "../utils/validRoles.js";

// Concatenate "Super Admin" to validRoles
const allRoles = ["Super Admin", ...validRoles];

// Helper function to convert string to sentence case
const toSentenceCase = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
      enum: allRoles, // Use the concatenated roles array
    },
    roleRequestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    approvedAt: { type: Date },  // Store the rejection time
    rejectedAt: { type: Date },  // Store the rejection time
    approvedRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    rejectedRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  { timestamps: true }
);

// Pre-save hook to convert fullName to sentence case
userSchema.pre('save', function(next) {
  this.fullName = toSentenceCase(this.fullName);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
