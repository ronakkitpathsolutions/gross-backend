import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    trim: true,
  },
  product_id: {
    type: String,
    required: true,
    trim: true,
  },
  store_id: {
    type: String,
    required: true,
    trim: true,
  },
  qty: {
    type: Number,
    default: 1,
    trim: true,
  },
});

export default mongoose.model("Cart", cartSchema);
