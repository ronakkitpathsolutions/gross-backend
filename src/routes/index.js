import { Router } from 'express'
import authRouter from './auth/index.js'
import { TYPES } from '../utils/constant.js'
import userRouter from './user/index.js'

const router = Router()

router.get('/', async(req, res) => res.json({
    type: TYPES.SUCCESS,
    message: 'Server started.'
}))
router.use(authRouter)
router.use(userRouter)


export default router