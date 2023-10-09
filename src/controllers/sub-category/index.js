import dotenv from "dotenv";
import { response, serverError } from "../../utils/functions.js";
import Helper from "../../utils/helper.js";
import {
  RESPONSE_MESSAGES,
  STATUS_CODES,
  TYPES,
} from "../../utils/constant.js";
import Category from "../../models/category/index.js";
import SubCategory from "../../models/sub-category/index.js";
import products from "../../models/products/index.js";

class SubCategoryController {
  constructor() {
    dotenv.config();
  }

  createSubCategory = async (req, res) => {
    try {
      const { sub_category, store_id, category_id } = req.body;

      const isAllFieldRequired = Helper.allFieldsAreRequired([
        sub_category,
        category_id,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      const isAllObjectId = Helper.isAllObjectId([store_id, category_id]);
      if (!isAllObjectId)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          }),
        );

      const isExistCategory = await Category.findById(category_id);
      if (!isExistCategory)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: "Category not found.",
          }),
        );

      const isExistSubCategory = await SubCategory.findOne({ sub_category });

      if (isExistSubCategory)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: "Sub category already exist.",
          }),
        );

      const data = new SubCategory({
        store_id,
        category_id,
        sub_category,
        image: req?.file?.location ? req?.file?.location : null,
      });

      await data.save();

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          message: "Sub-Category successfully added.",
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  getAllSubCategory = async (req, res) => {
    try {
      const { _id } = req.params;

      const data = await SubCategory.find({ category_id: _id }).select({
        __v: 0,
      });

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

  getByCategory = async (req, res) => {
    try {
      const { store_id } = req.body;
      const { sub_category } = req.params;
      const { order, orderBy } = req.query;

      const isExistCategory = await SubCategory.find({ sub_category });
      if (!isExistCategory)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: "category not found",
          }),
        );
      const data = await products.find({ sub_category, store_id }).select({
        _v: 0
      });

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          data: (orderBy && order) ? Helper.applySortFilter(data, order, orderBy) : data
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };
}

export default new SubCategoryController();
