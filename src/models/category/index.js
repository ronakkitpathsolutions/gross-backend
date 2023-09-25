import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
    trim: true,
  },
  store_id: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.model("Category", categorySchema);
