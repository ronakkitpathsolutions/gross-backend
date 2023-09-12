import { Router } from 'express'
import UserController from '../../controllers/user/index.js'
import Middlewares from '../../middlewares/index.js'

const userRouter = Router()

userRouter.get('/admin/users', [Middlewares.authentication, Middlewares.isAdmin], UserController.getUsers)
userRouter.get('/admin/user/:_id', [Middlewares.authentication, Middlewares.isAdmin, Middlewares.isValidObjectId], UserController.getUser)

export default userRouter