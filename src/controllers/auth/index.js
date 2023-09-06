import dotenv from 'dotenv'
import { STATUS_CODES, TYPES } from '../../utils/constant.js'
import { response, serverError } from '../../utils/functions.js'
import User from '../../models/user/index.js'
import Helper from '../../utils/helper.js'
import JWT from '../../utils/jwt.js'
import Bcrypt from '../../utils/bcrypt.js'

class AuthController {
    constructor() {
		dotenv.config()
	}

    createUser = async (req, res) => {
		try {
			const { username, email, contact, password, confirm_password, ...body } =
				req.body

			const isAllFieldRequired = Helper.allFieldsAreRequired([
				username,
				email,
				contact,
				password,
				confirm_password
			])
			if (isAllFieldRequired)
				return res.status(STATUS_CODES.BAD_REQUEST).json(
					response({
						type: TYPES.ERROR,
						message: 'All fields are required.'
					})
				)

			if (password !== confirm_password)
				return res.status(STATUS_CODES.BAD_REQUEST).json(
					response({
						type: TYPES.ERROR,
						message: 'password and confirm password does not matched.'
					})
				)

			const existUser = await User.findOne({ email })
			if (!!existUser)
				return res.status(STATUS_CODES.BAD_REQUEST).json(
					response({
						type: TYPES.ERROR,
						message: 'Email already exist.'
					})
				)

			const data = new User({
				username,
				email,
				contact,
				password: await Bcrypt.hashPassword(password),
				...body
			})
			const userData = await data.save()

			return res.status(STATUS_CODES.CREATED).json(
				response({
					type: TYPES.SUCCESS,
					message: 'User register successfully.',
					token: await JWT.generateNewToken({
						user_id: userData?._id,
						email: userData?.email,
						role: userData?.role,
						username: userData?.username,
						contact: userData?.contact
					})
				})
			)
		} catch (error) {
			serverError(error, res)
		}
	}

    loginUser = async (req, res) => {
		try {
			const { email, password } = req.body

			const isAllFieldRequired = Helper.allFieldsAreRequired([email, password])
			if (isAllFieldRequired)
				return res.status(STATUS_CODES.BAD_REQUEST).json(
					response({
						type: TYPES.ERROR,
						message: 'All fields are required.'
					})
				)

			const findUser = await User.findOne({ email })

			if (!findUser)
				return res.status(STATUS_CODES.BAD_REQUEST).json(
					response({
						type: TYPES.ERROR,
						message: 'User not found this email address.'
					})
				)

			const isAuthenticated = await Bcrypt.comparePassword(
				password,
				findUser?.password
			)

			if (!isAuthenticated)
				return res.status(STATUS_CODES.UN_AUTHORIZED).json(
					response({
						type: TYPES.ERROR,
						message: 'Invalid username or password.'
					})
				)

			return res.status(STATUS_CODES.SUCCESS).json(
				response({
					type: TYPES.SUCCESS,
					message: 'User login successfully.',
					token: await JWT.generateNewToken({
						user_id: findUser?._id,
						email: findUser?.email,
						role: findUser?.role,
						username: findUser?.username,
						contact: findUser?.contact
					})
				})
			)
		} catch (error) {
			serverError(error, res)
		}
	}
}

export default new AuthController()