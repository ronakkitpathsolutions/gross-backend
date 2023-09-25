import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema({
    sub_category: {
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
    category_id: {
        type: String,
        required: true,
        trim: true
    }
});

export default mongoose.model("SubCategory", subCategorySchema);
