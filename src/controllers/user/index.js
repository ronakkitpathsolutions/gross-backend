import dotenv from "dotenv";
import User from "../../models/user/index.js";
import { STATUS_CODES, TYPES } from "../../utils/constant.js";
import { response, serverError } from "../../utils/functions.js";

class UserController {
  constructor() {
    dotenv.config();
  }

  getUsers = async (req, res) => {
    try {
      const users = await User.find({}).select({
        password: 0,
        __v: 0,
        created_At: 0,
      });
      if (!users)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            data: [],
            message: "Not found.",
          }),
        );

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          data: users,
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  getUser = async (req, res) => {
    try {
      const { _id } = req.params;
      const user = await User.findById(_id).select({
        __v: 0,
        password: 0,
        created_At: 0,
      });

      if (!user)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: "Not found.",
            user,
          }),
        );

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          data: user,
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };
}

export default new UserController();
