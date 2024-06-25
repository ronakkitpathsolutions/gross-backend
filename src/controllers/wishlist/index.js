import dotenv from "dotenv";
import { response, serverError } from "../../utils/functions.js";
import Helper from "../../utils/helper.js";
import {
  RESPONSE_MESSAGES,
  STATUS_CODES,
  TYPES,
} from "../../utils/constant.js";
import Wishlist from "../../models/wishlist/index.js";
import Product from "../../models/products/index.js";

class WishlistController {
  constructor() {
    dotenv.config();
  }

  addToWishlist = async (req, res) => {
    try {
      const { user_id, product_id, store_id } = req.body;

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
          }),
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
          }),
        );

      // check is product exist or not
      const isExistProduct = await Product.findOne({
        _id: product_id,
        store_id,
      });
      if (!isExistProduct)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.NOT_FOUND,
          }),
        );

      const isExist = await Wishlist.findOne({ product_id, user_id });
      if (isExist)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: "Product already added in wishlist",
          }),
        );

      const data = new Wishlist({
        product_id,
        user_id,
        store_id,
      });
      await data.save();

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          message: "Product successfully added in the wishlist",
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  removeWishlist = async (req, res) => {
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

      const isDeleted = await Wishlist.findByIdAndDelete(_id);
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
          message: "Product successfully removed in the wishlist",
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  getWishlist = async (req, res) => {
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
            as: "wishlists",
          },
        },
        {
          $unwind: {
            path: "$wishlists",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            __v: 0,
            user_id: 0,
            product_id: 0,
            wishlists: {
              __v: 0,
              user_id: 0,
              store_id: 0,
            },
          },
        },
      ];

      const result = await Wishlist.aggregate(pipeline);
      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          data: result,
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };
}

export default new WishlistController();
