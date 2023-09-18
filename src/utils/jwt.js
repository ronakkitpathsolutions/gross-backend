import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { USER_ROLES } from './constant.js'
import { createObject } from './functions.js'


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
			? String(isAdminAuthorized?.role).toLowerCase() === USER_ROLES.ADMIN
			: String(isAdminAuthorized?.role).toLowerCase() === USER_ROLES.USER
	}

	getUserAccess = async (token) => {
		const isVerified = await this.verifyUserToken(token)
		return String(isVerified?.role).toLowerCase()
	}
}

export default new JWT()