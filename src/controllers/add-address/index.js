import dotenv from "dotenv";
import User from "../../models/user/index.js";
import { response, serverError } from "../../utils/functions.js";
import Address from "../../models/address/index.js";
import Helper from "../../utils/helper.js";
import mongoose from "mongoose";
import {
  RESPONSE_MESSAGES,
  STATUS_CODES,
  TYPES,
} from "../../utils/constant.js";

class AddressController {
  constructor() {
    dotenv.config();
  }

  addAddress = async (req, res) => {
    try {
      const {
        state,
        country,
        address_line1,
        address_line2,
        pin_code,
        city,
        user_id,
      } = req.body;
      const isAllFieldRequired = Helper.allFieldsAreRequired([
        state,
        country,
        address_line1,
        pin_code,
        city,
        user_id,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      const isAllObjectId = Helper.isAllObjectId([user_id]);
      if (!isAllObjectId)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          }),
        );

      const isExist = await User.findById(user_id);
      if (!isExist)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: "User Not Found",
          }),
        );
      const data = new Address({
        state,
        country,
        address_line2,
        address_line1,
        pin_code,
        city,
        user_id,
      });
      await data.save();
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

  deleteAddress = async (req, res) => {
    const { address_id } = req.params;

    const isAllFieldRequired = Helper.allFieldsAreRequired([address_id]);
    if (isAllFieldRequired)
      return res.status(STATUS_CODES.BAD_REQUEST).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.REQUIRED,
        }),
      );

    const isAllObjectId = Helper.isAllObjectId([address_id]);
    if (!isAllObjectId)
      return res.status(STATUS_CODES.BAD_REQUEST).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.INVALID_ID,
        }),
      );

    const isDeleted = await Address.findByIdAndDelete(address_id);
    if (!isDeleted)
      return res.status(STATUS_CODES.NOT_FOUND).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.NOT_FOUND,
        }),
      );
    return res.status(STATUS_CODES.SUCCESS).json(
      response({
        type: TYPES.SUCCESS,
        message: "Address successfully removed",
      }),
    );
  };

  getUserAddress = async (req, res) => {
    const { user_id } = req.params;
    const isAllFieldRequired = Helper.allFieldsAreRequired([user_id]);

    if (isAllFieldRequired)
      return res.status(STATUS_CODES.BAD_REQUEST).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.REQUIRED,
        }),
      );

    const isAllObjectId = Helper.isAllObjectId([user_id]);
    if (!isAllObjectId)
      return res.status(STATUS_CODES.BAD_REQUEST).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.INVALID_ID,
        }),
      );
    const isExist = await Address.find({ user_id }).select({
      user_id: 0,
      __v: 0,
    });
    if (!isExist)
      return res.status(STATUS_CODES.NOT_FOUND).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.NOT_FOUND,
        }),
      );
    return res.status(STATUS_CODES.SUCCESS).json(
      response({
        type: TYPES.SUCCESS,
        data: isExist,
      }),
    );
  };

  getAllAddress = async (req, res) => {
    const data = await Address.find({}).select({ __v: 0 });
    return res.status(STATUS_CODES.SUCCESS).json(
      response({
        type: TYPES.SUCCESS,
        data,
      }),
    );
  };

  editAddress = async (req, res) => {
    const { address_id } = req.params;
    const { state, country, address_line2, address_line1, pin_code, city } =
      req.body;

    const isAllObjectId = Helper.isAllObjectId([address_id]);
    if (!isAllObjectId)
      return res.status(STATUS_CODES.BAD_REQUEST).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.INVALID_ID,
        }),
      );

    await Address.findByIdAndUpdate(address_id, {
      state,
      country,
      address_line2,
      address_line1,
      pin_code,
      city,
    });
    const data = await Address.findById(address_id);
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
  };
}

export default new AddressController();
