import dotenv from "dotenv";
import Roles from "../../models/roles/index.js";
import {
  RESPONSE_MESSAGES,
  STATUS_CODES,
  TYPES,
} from "../../utils/constant.js";
import Helper from "../../utils/helper.js";
import { response, serverError } from "../../utils/functions.js";
import mongoose from "mongoose";

class RolesController {
  constructor() {
    dotenv.config();
  }

  createRoles = async (req, res) => {
    try {
      const { name, description } = req.body;

      const isAllFieldRequired = Helper.allFieldsAreRequired([
        name,
        description,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          })
        );
      const existingRole = await Roles.findOne({ name });

      if (existingRole) {
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: "Role is already added",
          })
        );
      }

      const data = new Roles({
        name,
        description,
      });
      const roleData = await data.save();
      return res.status(STATUS_CODES.CREATED).json(
        response({
          type: TYPES.SUCCESS,
          data: roleData,
        })
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  removeRoles = async (req, res) => {
    try {
      const { _id } = req.params;

      const isAllFieldRequired = Helper.allFieldsAreRequired([_id]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          })
        );
      const isAllObjectId = Helper.isAllObjectId([_id]);
      if (!isAllObjectId)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          })
        );

      const isDeleted = await Roles.findByIdAndDelete({ _id });
      if (!isDeleted)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.NOT_FOUND,
          })
        );
      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          message: "Roles successfully removed",
        })
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  getAllRoles = async (req, res) => {
    try {
      const data = await Roles.find({});
      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          data,
        })
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  editRoles = async (req, res) => {
    const { name, description } = req.body;
    const { _id } = req.params;

    const isAllObjectId = Helper.isAllObjectId([_id]);
    if (!isAllObjectId)
      return res.status(STATUS_CODES.BAD_REQUEST).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.INVALID_ID,
        })
      );

    const existingRole = await Roles.findOne({ name });

    if (existingRole) {
      return res.status(STATUS_CODES.BAD_REQUEST).json(
        response({
          type: TYPES.ERROR,
          message: "Role is already added",
        })
      );
    }

    await Roles.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id) },
      {
        name,
        description,
      }
    );
    const data = await Roles.findOne({
      _id: new mongoose.Types.ObjectId(_id),
    }).select({ __v: 0 });
    if (!data)
      return res.status(STATUS_CODES.NOT_FOUND).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.NOT_FOUND,
        })
      );

    return res.status(STATUS_CODES.SUCCESS).json(
      response({
        type: TYPES.SUCCESS,
        data,
      })
    );
  };
}

export default new RolesController();
