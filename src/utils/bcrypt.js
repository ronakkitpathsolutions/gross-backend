import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

class Bcrypt {
    constructor() {
		dotenv.config()
	}

    hashPassword = async (value) => {
		const hashedPassword = await new Promise((resolve, reject) => {
			bcrypt.hash(value, Number(process.env.SALT_ROUND), (err, hash) => {
				if (err) reject(err)
				resolve(hash)
			})
		})
		return hashedPassword
	}

    comparePassword = async (password, hashValue) => {
		const compared = await new Promise((resolve, reject) => {
			bcrypt.compare(password, hashValue, (err, response) => {
				if (err) reject(err)
				resolve(response)
			})
		})
		return compared
	}
}

export default new Bcrypt()