import dotenv from "dotenv";
import { response, serverError } from "../../utils/functions.js";
import Helper from "../../utils/helper.js";
import {
    RESPONSE_MESSAGES,
    STATUS_CODES,
    TYPES,
} from "../../utils/constant.js";
import Product from "../../models/products/index.js";

class ProductController {
    constructor() {
        dotenv.config();
    }

    createProduct = async (req, res) => {
        try {
            const { user_id, store_id, product_name, price, ...body } = req.body;

            const isAllFieldRequired = Helper.allFieldsAreRequired([
                product_name,
                price,
            ]);
            if (isAllFieldRequired)
                return res.status(STATUS_CODES.BAD_REQUEST).json(
                    response({
                        type: TYPES.ERROR,
                        message: RESPONSE_MESSAGES.REQUIRED,
                    })
                );

            const data = new Product({
                user_id,
                store_id,
                product_name,
                price,
                product_image: req.file ? req.file?.location : null,
                product_description: body?.product_description || null,
                category: body?.category || null,
                manufacturer_by: {
                    name: body?.name || null,
                    email: body?.email || null,
                    contact: body?.contact || null,
                    address: body?.address || null,
                },
            });

            const product = await data.save();

            return res.status(STATUS_CODES.CREATED).json(
                response({
                    type: TYPES.SUCCESS,
                    data: product,
                })
            );
        } catch (error) {
            serverError(error, res);
        }
    };

    getAllProducts = async (req, res) => {
        try {
            const { store_id } = req.body;
            const data = await Product.find({ store_id }).select({
                __v: 0,
            });
            if (!data)
                return res.status(STATUS_CODES.NOT_FOUND).json(
                    response({
                        type: TYPES.ERROR,
                        message: RESPONSE_MESSAGES.NOT_FOUND,
                    })
                );

            return res
                .status(STATUS_CODES.SUCCESS)
                .json(response({ type: TYPES.SUCCESS, data }));
        } catch (error) {
            serverError(error, res);
        }
    };
}

export default new ProductController();
