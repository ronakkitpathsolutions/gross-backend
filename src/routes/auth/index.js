import { Router } from 'express'
import AuthController from '../../controllers/auth/index.js'

const authRouter = Router()

authRouter.post('/user/create', AuthController.createUser)
authRouter.post('/user/login', AuthController.loginUser)

export default authRouter