import { Router } from 'express'
import AuthController from '../../controllers/auth/index.js'
import MiddleWares from '../../middlewares/index.js'

const authRouter = Router()

authRouter.post('/user/create', AuthController.createUser)
authRouter.post('/user/login', AuthController.loginUser)
authRouter.put('/user/change-password', [MiddleWares.authentication], AuthController.resetPassword)


authRouter.post('/admin/master-access', [MiddleWares.authentication, MiddleWares.isAdmin], AuthController.masterLogin)

export default authRouter