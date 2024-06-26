import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  created_At: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    trim: true,
    default: "user",
  },
  contact: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  full_name: {
    type: String,
    default: null,
    trim: true,
  },
  profile: {
    type: String,
    default: null,
    trim: true,
  },
  gender: {
    type: String,
    default: null,
    trim: true,
  },
  DOB: {
    type: Date,
    default: null,
    trim: true,
  },
});

export default mongoose.model("Users", userSchema);
