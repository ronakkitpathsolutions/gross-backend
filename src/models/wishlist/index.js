import mongoose, { Schema } from 'mongoose'

const wishlistSchema = new Schema({
    product_id: {
        type: String,
		required: true,
		trim: true
    },
    user_id: {
        type: String,
		required: true,
		trim: true
    }
})

export default mongoose.model('Wishlists', wishlistSchema)