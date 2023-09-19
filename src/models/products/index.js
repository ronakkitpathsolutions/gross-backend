import mongoose, { Schema } from 'mongoose'

const productSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        trim: true
    },
    store_id: {
        type: String,
        required: true,
        trim: true
    },
    product_name: {
        type: String,
        required: true,
        trim: true
    },
    product_description: {
        type: String,
        required: false,
        default: null,
        trim: true
    },
    category: {
        type: String,
        required: false,
        default: null,
        trim: true
    },
    product_image: {
        type: String,
        required: false,
        default: null,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    manufacturer_by: {
        name: {
            type: String,
            required: false,
            default: null,
            trim: true
        },
        contact: {
            type: String,
            required: false,
            default: null,
            trim: true
        },
        email: {
            type: String,
            required: false,
            default: null,
            trim: true
        },
        address: {
            type: String,
            required: false,
            default: null,
            trim: true
        }
    },
})

export default mongoose.model('Products', productSchema)