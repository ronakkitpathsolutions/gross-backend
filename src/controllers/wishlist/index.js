import dotenv from 'dotenv'
import { response, serverError } from '../../utils/functions.js'
import Helper from '../../utils/helper.js'
import { RESPONSE_MESSAGES, STATUS_CODES, TYPES } from '../../utils/constant.js'
import Wishlist from '../../models/wishlist/index.js'


class WishlistController {
    constructor() {
        dotenv.config()
    }

    addToWishlist = async (req, res) => {
        try {
            const { user_id, product_id } = req.body

            const isAllFieldRequired = Helper.allFieldsAreRequired([user_id, product_id])

            if (isAllFieldRequired) return res.status(STATUS_CODES.BAD_REQUEST).json(
                response({
                    type: TYPES.ERROR,
                    message: 'All fields are required.'
                })
            )

            const isAllObjectId = Helper.isAllObjectId([user_id, product_id])
            if (!isAllObjectId) return res.status(STATUS_CODES.BAD_REQUEST).json(
                response({
                    type: TYPES.ERROR,
                    message: 'Invalid Object id'
                })
            )

            const isExist = await Wishlist.findOne({ product_id })
            if (isExist) return res.status(STATUS_CODES.NOT_FOUND).json(
                response({
                    type: TYPES.ERROR,
                    message: 'Product already added in wishlist'
                })
            )

            const data = new Wishlist({
                product_id,
                user_id
            })
            await data.save()

            return res.status(STATUS_CODES.SUCCESS).json(
                response({
                    type: TYPES.SUCCESS,
                    message: 'Product successfully added in the wishlist'
                })
            )

        } catch (error) {
            serverError(error, res)
        }
    }

    removeWishlist = async (req, res) => {
        try {
            const { user_id, product_id } = req.body

            const isAllFieldRequired = Helper.allFieldsAreRequired([user_id, product_id])
            if (isAllFieldRequired) return res.status(STATUS_CODES.BAD_REQUEST).json(
                response({
                    type: TYPES.ERROR,
                    message: 'All fields are required.'
                })
            )

            const isAllObjectId = Helper.isAllObjectId([user_id, product_id])
            if (!isAllObjectId) return res.status(STATUS_CODES.BAD_REQUEST).json(
                response({
                    type: TYPES.ERROR,
                    message: 'Invalid Object id'
                })
            )

            const isExist = await Wishlist.findOne({ product_id })
            if(isExist){
                const isDeleted = await Wishlist.findOneAndDelete({ product_id })
                
                if(isDeleted) return res.status(STATUS_CODES.SUCCESS).json(
                    response({
                        type: TYPES.ERROR,
                        message: 'Product successfully removed in the wishlist'
                    })
                )

            } else return res.status(STATUS_CODES.NOT_FOUND).json(
                response({
                    type: TYPES.ERROR,
                    message: RESPONSE_MESSAGES.NOT_FOUND
                })
            ) 

        } catch (error) {
            serverError(error, res)
        }
    }
}

export default new WishlistController()