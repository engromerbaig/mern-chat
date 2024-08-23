import mongoose from "mongoose";
import { validRoles } from "../utils/validRoles.js";

// Concatenate "Super Admin" to validRoles
const allRoles = ["Super Admin", ...validRoles];

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

const User = mongoose.model("User", userSchema);

export default User;
