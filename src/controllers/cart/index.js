import dotenv from "dotenv";
import Product from "../../models/products/index.js";
import {
  STATUS_CODES,
  TYPES,
  RESPONSE_MESSAGES,
} from "../../utils/constant.js";
import { response, serverError } from "../../utils/functions.js";
import Helper from "../../utils/helper.js";
import cart from "../../models/cart/index.js";

class CartController {
  constructor() {
    dotenv.config();
  }

  addToCart = async (req, res) => {
    try {
      const { user_id, product_id, store_id, qty } = req.body;

      const isAllFieldRequired = Helper.allFieldsAreRequired([
        user_id,
        product_id,
        store_id,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          })
        );

      const isAllObjectId = Helper.isAllObjectId([
        user_id,
        product_id,
        store_id,
      ]);
      if (!isAllObjectId)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          })
        );

      const isExistProduct = await Product.findOne({
        _id: product_id,
        user_id: store_id,
      });
      if (!isExistProduct)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.NOT_FOUND,
          })
        );
      const isExist = await cart.findOne({ product_id });
      if (isExist)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: "Product already added in Cart",
          })
        );

      const data = new cart({
        user_id,
        product_id,
        store_id,
        qty,
      });
      await data.save();

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          message: "Product successfully added in the cart",
        })
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  removeCartProduct = async (req, res) => {
    try {
      const { product_id, store_id, user_id } = req.body;
      const isAllFieldRequired = Helper.allFieldsAreRequired([
        product_id,
        store_id,
        user_id,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          })
        );

      const isAllObjectId = Helper.isAllObjectId([
        product_id,
        store_id,
        user_id,
      ]);
      if (!isAllObjectId)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          })
        );

      const isExistProduct = await Product.findOne({
        product_id,
        store_id,
        user_id,
      });
      if (isExistProduct) {
        const isDeleted = await cart.findOneAndDelete({
          product_id,
          store_id,
          user_id,
        });

        if (isDeleted)
          return res.status(STATUS_CODES.SUCCESS).json(
            response({
              type: TYPES.ERROR,
              message: "Product successfully removed in the Cart",
            })
          );
      } else
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.NOT_FOUND,
          })
        );
    } catch (error) {
      serverError(error, res);
    }
  };

  getAllCart = async (req, res) => {
    try {
      const { user_id, store_id } = req.body;
      const isAllFieldRequired = Helper.allFieldsAreRequired([
        user_id,
        store_id,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          })
        );

      const isAllObjectId = Helper.isAllObjectId([user_id, store_id]);
      if (!isAllObjectId)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          })
        );
      const isExistStore = await cart.findOne({ user_id, store_id });
      if (!isExistStore)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: "User Not Found",
          })
        );

      const pipeline = [
        {
          $addFields: {
            product_id: {
              $toObjectId: "$product_id",
            },
          },
        },
        {
          $match: {
            user_id,
            store_id,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "CartData",
          },
        },
        {
          $unwind: {
            path: "$CartData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            user_id: 0,
            product_id: 0,
            store_id: 0,
            __v: 0,
            CartData: {
              user_id: 0,
              store_id: 0,
              __v: 0,
            },
          },
        },
      ];

      const CartData = await cart.aggregate(pipeline);
      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          data: CartData,
        })
      );
    } catch (error) {
      serverError(error, res);
    }
  };
}

export default new CartController();
