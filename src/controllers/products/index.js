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
          }),
        );

      const data = new Product({
        user_id,
        store_id,
        product_name,
        price,
        product_image: req.file ? req.file?.location : null,
        product_description: body?.product_description || null,
        category: body?.category,
        sub_category: body?.sub_category,
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
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  getAllProducts = async (req, res) => {
    try {
      const { store_id } = req.body;
      const { order, orderBy } = req.query;

      const data = await Product.find({ store_id }).select({
        __v: 0,
      });

      if (!data)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.NOT_FOUND,
          }),
        );

      return res
        .status(STATUS_CODES.SUCCESS)
        .json(response({ type: TYPES.SUCCESS, data: (orderBy && order) ? Helper.applySortFilter(data, order, orderBy) : data }));
    } catch (error) {
      serverError(error, res);
    }
  };

  getProductById = async (req, res) => {
    try {
      const { _id } = req.params;

      const isAllFieldRequired = Helper.allFieldsAreRequired([_id]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      const isAllObjectId = Helper.isAllObjectId([_id]);
      if (!isAllObjectId)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          }),
        );

      const data = await Product.findById(_id).select({
        __v: 0,
        created_At: 0,
      });
      if (!data)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.NOT_FOUND,
          }),
        );

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          data,
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  removeProductById = async (req, res) => {
    const { _id } = req.params;
    const { user_id, store_id } = req.body;

    const isAllFieldRequired = Helper.allFieldsAreRequired([user_id, store_id]);
    if (isAllFieldRequired)
      return res.status(STATUS_CODES.BAD_REQUEST).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.REQUIRED,
        }),
      );

    const isAllObjectId = Helper.isAllObjectId([user_id, store_id]);
    if (!isAllObjectId)
      return res.status(STATUS_CODES.BAD_REQUEST).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.INVALID_ID,
        }),
      );

    const isDeleted = await Product.findByIdAndDelete(_id);
    if (!isDeleted)
      return res.status(STATUS_CODES.NOT_FOUND).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.NOT_FOUND,
        }),
      );

    return res.status(STATUS_CODES.SUCCESS).json(
      response({
        type: TYPES.ERROR,
        message: "Product successfully removed from Store",
      }),
    );
  };

  searchProduct = async (req, res) => {
    const { name } = req.query;
    if (name) {
      const regex = new RegExp(`.*${name}.*`, "i");
      const results = await Product.find({ product_name: regex });
      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          results,
        }),
      );
    }
    return res.status(STATUS_CODES.NOT_FOUND).json(
      response({
        type: TYPES.ERROR,
        message: RESPONSE_MESSAGES,
      }),
    );
  };
}

export default new ProductController();
