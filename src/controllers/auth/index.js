import dotenv from "dotenv";
import {
  MASTER_ACCESS,
  RESPONSE_MESSAGES,
  STATUS_CODES,
  TYPES,
} from "../../utils/constant.js";
import { response, serverError } from "../../utils/functions.js";
import User from "../../models/user/index.js";
import Helper from "../../utils/helper.js";
import JWT from "../../utils/jwt.js";
import Bcrypt from "../../utils/bcrypt.js";

class AuthController {
  constructor() {
    dotenv.config();
  }

  createUser = async (req, res) => {
    try {
      const { username, email, contact, password, confirm_password, ...body } =
        req.body;

      const isAllFieldRequired = Helper.allFieldsAreRequired([
        username,
        email,
        contact,
        password,
        confirm_password,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      if (password !== confirm_password)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: "password and confirm password does not matched.",
          }),
        );

      const existUser = await User.findOne({ email });
      if (!!existUser)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: "Email already exist.",
          }),
        );

      const data = new User({
        username,
        email,
        contact,
        password: await Bcrypt.hashPassword(password),
        ...body,
      });

      const userData = await data.save();

      return res.status(STATUS_CODES.CREATED).json(
        response({
          type: TYPES.SUCCESS,
          message: "User register successfully.",
          token: await JWT.generateNewToken(
            {
              user_id: userData?._id,
              email: userData?.email,
              role: userData?.role,
              username: userData?.username,
              contact: userData?.contact,
            },
            60 * 24,
          ),
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      const isAllFieldRequired = Helper.allFieldsAreRequired([email, password]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      const findUser = await User.findOne({ email });

      if (!findUser)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: "User not found this email address.",
          }),
        );

      const isAuthenticated = await Bcrypt.comparePassword(
        password,
        findUser?.password,
      );

      if (!isAuthenticated)
        return res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: "Invalid username or password.",
          }),
        );

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          message: "User login successfully.",
          token: await JWT.generateNewToken(
            {
              user_id: findUser?._id,
              email: findUser?.email,
              role: findUser?.role,
              username: findUser?.username,
              contact: findUser?.contact,
            },
            60 * 24,
          ),
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { old_password, new_password, confirm_password } = req.body;
      const { token } = req.headers;

      const isAllFieldRequired = Helper.allFieldsAreRequired([
        old_password,
        new_password,
        confirm_password,
      ]);

      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      if (confirm_password !== new_password)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: "password and confirm password does not matched.",
          }),
        );

      const userData = await JWT.verifyUserToken(token);
      if (!userData)
        return res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: "User not found.",
          }),
        );

      const user = await User.findById(userData?.user_id);
      if (!user)
        return res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: "User not found.",
          }),
        );

      const matched = await Bcrypt.matchPassword(old_password, user?.password);
      if (!matched)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: "Invalid Old password.",
          }),
        );

      await User.findByIdAndUpdate(user?.id, {
        password: await Bcrypt.hashPassword(new_password),
      });

      return res.status(STATUS_CODES.CREATED).json(
        response({
          type: TYPES.SUCCESS,
          message: "Password reset successfully.",
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  masterLogin = async (req, res) => {
    try {
      const { email, master_password } = req.body;

      const isAllFieldRequired = Helper.allFieldsAreRequired([
        email,
        master_password,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      const findUser = await User.findOne({ email });

      if (!findUser)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: "User not found this email address.",
          }),
        );

      if (master_password !== MASTER_ACCESS)
        return res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: "Invalid Password.",
          }),
        );

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          message: "User login successfully.",
          token: await JWT.generateNewToken({
            user_id: findUser?._id,
            email: findUser?.email,
            role: findUser?.role,
            username: findUser?.username,
            contact: findUser?.contact,
          }),
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  getProfile = async (req, res) => {
    try {
      const { _id } = req.params;

      const profile = await User.findById(_id).select({
        __v: 0,
        created_At: 0,
      });

      if (!profile)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.NOT_FOUND,
          }),
        );

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          data: profile,
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  updateProfile = async (req, res) => {
    try {
      const { full_name, DOB, gender, contact } = req.body;
      const { _id } = req.params;

      const isAllFieldRequired = Helper.allFieldsAreRequired([
        full_name,
        DOB,
        gender,
        contact,
      ]);

      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      const update = req.file
        ? { full_name, DOB, gender, contact, profile: req?.file?.location }
        : { full_name, DOB, gender, contact };
      await User.findByIdAndUpdate(_id, update);

      const profile = await User.findById(_id).select({
        __v: 0,
        created_At: 0,
        password: 0,
      });

      if (!profile)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.NOT_FOUND,
          }),
        );

      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          data: profile,
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const { email, link } = req.body;

      const isAllFieldRequired = Helper.allFieldsAreRequired([email]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      const isExistEmail = await User.findOne({ email });
      if (!isExistEmail)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: "User Not Found",
          }),
        );

      const generateToken = await JWT.generateNewToken(
        {
          user_id: isExistEmail?._id,
          email: isExistEmail?.email,
          role: isExistEmail?.role,
          username: isExistEmail?.username,
          contact: isExistEmail?.contact,
        },
        15,
      );

      await Helper.sendResetEmail(
        email,
        Helper.resetEmailFormat(`${link}?token=${generateToken}`),
        "Password Reset",
      );
      return res.status(STATUS_CODES.SUCCESS).json(
        response({
          type: TYPES.SUCCESS,
          message: "Reset Link Sent,Check your mail",
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  newPassword = async (req, res) => {
    try {
      const { newpassword, token } = req.body;
      const isAllFieldRequired = Helper.allFieldsAreRequired([
        newpassword,
        token,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      const userData = await JWT.verifyUserToken(token);
      if (!userData)
        return res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: "User not found.",
          }),
        );

      await User.findByIdAndUpdate(userData?.user_id, {
        password: await Bcrypt.hashPassword(newpassword),
      });

      return res.status(STATUS_CODES.CREATED).json(
        response({
          type: TYPES.SUCCESS,
          message: "Password reset successfully.",
        }),
      );
    } catch (error) {
      serverError(error, res);
    }
  };
}

export default new AuthController();
