import { Router } from 'express'
import { TYPES } from '../utils/constant.js'

// routes
import authRouter from './auth/index.js'
import userRouter from './user/index.js'
import wishlistRouter from './wishlist/index.js'
import categoryRouter from './category/index.js'
import storeRouter from './store/index.js'
import productRouter from './products/index.js'

const router = Router()

router.get('/', async (req, res) => res.json({
    type: TYPES.SUCCESS,
    message: 'Server started.'
}))
router.use(authRouter)
router.use(userRouter)
router.use(wishlistRouter)
router.use(categoryRouter)
router.use(storeRouter)
router.use(productRouter)


export default router