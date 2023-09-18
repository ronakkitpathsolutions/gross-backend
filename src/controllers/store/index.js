import Store from "../../models/store/index.js"
import dotenv from 'dotenv'
import Helper from "../../utils/helper.js"
import { STATUS_CODES, TYPES } from "../../utils/constant.js"
import { response, serverError } from "../../utils/functions.js"

class StoreController {

    constructor(){
        dotenv.config()
    }

    createStore = async(req, res) => {
        try {
            const { user_id, store_name, contact, ...body } = req.body

            const { store_image, store_banner } = req.files

            const isAllFieldRequired = Helper.allFieldsAreRequired([user_id, store_name, contact])
            if(isAllFieldRequired) return res.status(STATUS_CODES.BAD_REQUEST).json(
                response({
                    type: TYPES.ERROR,
                    message: 'All fields are required.'
                })
            )

            const isAllObjectId = Helper.isAllObjectId([user_id])
            if (!isAllObjectId) return res.status(STATUS_CODES.BAD_REQUEST).json(
                response({
                    type: TYPES.ERROR,
                    message: 'Invalid Object id'
                })
            )
            
            const data = new Store({
                user_id, store_name, info: {
                    contact, email: body?.email
                },
                store_image: store_image?.length ? store_image?.map(val => (val?.location))?.toString() : null,
                store_banner: store_banner?.length ? store_banner?.map(val => (val?.location))?.toString() : null
            })

            const storeData = await data.save()

            return res.status(STATUS_CODES.CREATED).json(response({
                type: TYPES.SUCCESS,
                data: storeData
            }))

        } catch (error) {
            serverError(error, res)
        }
    }    
}

export default new StoreController()