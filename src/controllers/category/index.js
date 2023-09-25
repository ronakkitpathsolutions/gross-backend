import dotenv from "dotenv";
import { response, serverError } from "../../utils/functions.js";
import Helper from "../../utils/helper.js";
import {
  RESPONSE_MESSAGES,
  STATUS_CODES,
  TYPES,
} from "../../utils/constant.js";
import Category from "../../models/category/index.js";

class CategoryController {
  constructor() {
    dotenv.config();
  }

  addNewCategory = async (req, res) => {
    try {
      const { store_id, category } = req.body;

      const isAllFieldRequired = Helper.allFieldsAreRequired([
        store_id,
        category,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      const isAllObjectId = Helper.isAllObjectId([store_id]);
      if (!isAllObjectId)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          }),
        );

      const isExist = await Category.findOne({ category, store_id });
      if (isExist)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: "Category already exist.",
          }),
        );

      const data = new Category({
        category,
        store_id,
        image: req?.file?.location ? req?.file?.location : null,
      });
      await data.save();

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          message: "Category successfully added.",
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  updateCategory = async (req, res) => {
    try {
      const { _id } = req.params;
      const { store_id, category } = req.body;
      const isAllFieldRequired = Helper.allFieldsAreRequired([store_id]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      const isAllObjectId = Helper.isAllObjectId([store_id]);
      if (!isAllObjectId)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          }),
        );

      await Category.findByIdAndUpdate(_id, {
        ...Helper.allFieldsAreNotRequired({
          category,
          image: req?.file?.location,
        }),
      });

      const data = await Category.findById(_id);
      if (!data)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: "Category not found.",
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

  deleteCategory = async (req, res) => {
    try {
      const { _id } = req.params;

      const deleteCategory = await Category.findByIdAndDelete(_id);

      if (!deleteCategory)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.NOT_FOUND,
          }),
        );

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          message: "Category successfully deleted.",
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  getAllCategory = async (req, res) => {
    try {
      const { store_id } = req.body;

      const isAllFieldRequired = Helper.allFieldsAreRequired([store_id]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      const isAllObjectId = Helper.isAllObjectId([store_id]);
      if (!isAllObjectId)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          }),
        );

      const category = await Category.find({ store_id }).select({
        __v: 0,
        created_At: 0,
        store_id: 0,
      });

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          data: category,
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };
}

export default new CategoryController();
