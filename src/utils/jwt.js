import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'


class JWT {
    constructor() {
		dotenv.config()
	}

    generateNewToken = async (payload, schedule = 60) => {
		const token = await new Promise((resolve, reject) => {
			jwt.sign(
				{ ...payload, exp: Math.floor(Date.now() / 1000) + schedule * 60 },
				process.env.SECRET_KEY,
				(err, data) => {
					if (err) reject(err)
					resolve(data)
				}
			)
		})
		return token
	}

    tokenExpired = async (token) => {
		try {
			const isExpired = jwt.verify(token, process.env.SECRET_KEY)
			if (!isExpired) return true
			return isExpired?.exp <= Math.floor(Date.now() / 1000)
		} catch (error) {
			return true
		}
	}

    verifyUserToken = async (token) => {
		const isVerified = jwt.verify(token, process.env.SECRET_KEY)
		return isVerified
	}

    handleAccess = async (token, isUsedForUser = false) => {
		const isAdminAuthorized = await this.verifyUserToken(token)
		return !isUsedForUser
			? String(isAdminAuthorized?.role).toLowerCase() === 'admin'
			: String(isAdminAuthorized?.role).toLowerCase() === 'user'
	}
}

export default new JWT()