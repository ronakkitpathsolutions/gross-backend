import mongoose, { Schema } from 'mongoose'

const storeSchema = new Schema({
    created_At: {
		type: Date,
		default: Date.now
	},
    user_id: {
        type: String,
		required: true,
		trim: true
    },
    store_name: {
        type: String,
        required: true,
		trim: true
    },
    info: {
        email: {
            type: String,
		    required: false,
            default: null,
		    trim: true
        },
        contact: {
            type: String,
		    required: true,
		    trim: true
        }
    },
    store_image: {
        type: String,
		required: false,
        default: null,
		trim: true
    },
    store_banner: {
        type: String,
		required: false,
        default: null,
		trim: true
    }
})

export default mongoose.model('Stores', storeSchema)
