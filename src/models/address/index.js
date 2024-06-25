import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
  city: {
    type: String,
    required: true,
    trim: true,
  },
  pin_code: {
    type: Number,
    required: true,
    trim: true,
  },
  address_line1: {
    type: String,
    required: true,
    trim: true,
  },
  address_line2: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  user_id: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.model("Address", addressSchema);
