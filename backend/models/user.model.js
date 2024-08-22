import mongoose from "mongoose";

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
      enum: [
		"Super Admin",
        "Manager",
        "Agent",
        "R&D Role",
        "R&D Admin Role",
        "FE Role",
        "Staff Access Control Role",
        "Closer Role",
        "Team Lead Role",
        "RNA Specialist Role",
        "CB Specialist Role",
        "Decline Specialist Role",
      ],
    },
    roleRequestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
