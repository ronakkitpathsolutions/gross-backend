import { Router } from 'express'
import AuthController from '../../controllers/auth/index.js'
import MiddleWares from '../../middlewares/index.js'

const authRouter = Router()

authRouter.post('/user/create', AuthController.createUser)
authRouter.post('/user/login', AuthController.loginUser)
authRouter.post('/user/change-password', [MiddleWares.authentication], AuthController.resetPassword)

export default authRouter