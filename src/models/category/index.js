import mongoose, { Schema } from 'mongoose'

const categorySchema = new Schema({
    created_At: {
		type: Date,
		default: Date.now
	},
    category: {
        type: String,
		required: true,
		trim: true
    },
    store_id: {
		type: String,
		required: true,
		trim: true
	},
})

export default mongoose.model('Category', categorySchema)