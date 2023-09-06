import { Router } from 'express'
import authRouter from './auth/index.js'

const router = Router()
router.use(authRouter)





export default router