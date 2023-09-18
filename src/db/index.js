import mongoose from 'mongoose'
import dotenv from 'dotenv'

class Database {
    constructor() {
		dotenv.config()
	}
    connection = async () => {
		const db = await mongoose.connect(process.env.MONGO_CONNECT)
		return db
	}
}

export default new Database()