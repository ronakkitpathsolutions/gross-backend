import dotenv from "dotenv";
import { Types } from "mongoose";
import {
  RESPONSE_MESSAGES,
  STATUS_CODES,
  TYPES,
  USER_ROLES,
} from "../utils/constant.js";
import { response, serverError } from "../utils/functions.js";
import JWT from "../utils/jwt.js";
import User from "../models/user/index.js";
import Helper from "../utils/helper.js";
import Store from "../models/store/index.js";

class MiddleWare {
  constructor() {
    dotenv.config();
  }

  isValidObjectId = (req, res, next) => {
    const { _id, form_id, attr_id } = req.params;
    if (Types.ObjectId.isValid(_id || form_id || attr_id)) next();
    else
      res.status(STATUS_CODES.UN_AUTHORIZED).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.INVALID_ID,
        }),
      );
  };

  authentication = async (req, res, next) => {
    try {
      const { token } = req.headers;
      if (!token)
        res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.PROVIDE_TOKEN,
          }),
        );
      else if (await JWT.tokenExpired(token))
        res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_TOKEN,
          }),
        );
      else next();
    } catch (error) {
      serverError(error, res);
    }
  };

  isAdmin = async (req, res, next) => {
    try {
      const { token } = req.headers;
      const isAdmin = await JWT.handleAccess(token);

      if (!isAdmin)
        res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.UN_AUTHORIZED_USER,
          }),
        );
      else next();
    } catch (error) {
      serverError(error, res);
    }
  };

  isStoreAdmin = async (req, res, next) => {
    try {
      const { token } = req.headers;
      const isStoreOwner = await JWT.getUserAccess(token);

      if (isStoreOwner !== USER_ROLES.STORE_ADMIN)
        res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.UN_AUTHORIZED_USER,
          }),
        );
      else next();
    } catch (error) {
      serverError(error, res);
    }
  };

  onlyForStoreAdmin = async (req, res, next) => {
    try {
      const { token } = req.headers;
      const { user_id } = req.body;

      const verifiedUser = await JWT.verifyUserToken(token);
      const findUser = await User.findById(verifiedUser?.user_id);

      if (findUser?.role === USER_ROLES.ADMIN) {
        return next();
      } else if (
        findUser?.role === USER_ROLES.STORE_ADMIN &&
        findUser?._id?.toString() === user_id
      ) {
        return next();
      } else
        return res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.UN_AUTHORIZED_USER,
          }),
        );
    } catch (error) {
      serverError(error, res);
    }
  };

  isUser = async (req, res, next) => {
    try {
      const { token } = req.headers;
      const isUser = await JWT.handleAccess(token, true);

      if (!isUser)
        res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.UN_AUTHORIZED_USER,
          }),
        );
      else next();
    } catch (error) {
      serverError(error, res);
    }
  };

  bothAreAccessible = async (req, res, next) => {
    try {
      const { token } = req.headers;
      const { _id } = req.params;

      const verifiedUser = await JWT.verifyUserToken(token);
      const findUser = await User.findById(verifiedUser?.user_id);

      if (
        verifiedUser?.role !== USER_ROLES.ADMIN &&
        findUser?._id?.toString() !== _id
      )
        res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.UN_AUTHORIZED_USER,
          }),
        );
      else return next();
    } catch (error) {
      serverError(error, res);
    }
  };

  getAccessForStoreAdminAndAdmin = async (req, res, next) => {
    const { token } = req.headers;
    const { _id } = req.params;

    const verifiedUser = await JWT.verifyUserToken(token);
    const findUser = await User.findById(verifiedUser?.user_id);

    if (findUser?.role === USER_ROLES.ADMIN) {
      return next();
    } else if (
      findUser?.role === USER_ROLES.STORE_ADMIN &&
      findUser?._id?.toString() === _id
    ) {
      return next();
    } else
      return res.status(STATUS_CODES.UN_AUTHORIZED).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.UN_AUTHORIZED_USER,
        }),
      );
  };

  getAccessByUserId = async (req, res, next) => {
    try {
      const { token } = req.headers;
      const { _id } = req.params;

      const verifiedUser = await JWT.verifyUserToken(token);
      const findUser = await User.findById(verifiedUser?.user_id);

      if (findUser?._id?.toString() !== _id)
        res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.UN_AUTHORIZED_USER,
          }),
        );
      else return next();
    } catch (error) {
      serverError(error, res);
    }
  };

  isOwnStore = async (req, res, next) => {
    try {
      const { store_id, user_id } = req.body;

      const isAllFieldRequired = Helper.allFieldsAreRequired([
        store_id,
        user_id,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      if (!Helper.isAllObjectId([store_id, user_id]))
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          }),
        );

      const store = await Store.findById(store_id);
      if (!store)
        return res.status(STATUS_CODES.NOT_FOUND).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.NOT_FOUND,
          }),
        );

      if (user_id !== store?.user_id)
        return res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.UN_AUTHORIZED_USER,
          }),
        );

      next();
    } catch (error) {
      serverError(error, res);
    }
  };

  isOwn = async (req, res, next) => {
    try {
      const { user_id } = req.body;
      const { token } = req.headers;

      const isAllFieldRequired = Helper.allFieldsAreRequired([user_id]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          }),
        );

      if (!Helper.isAllObjectId([user_id]))
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          }),
        );

      const verifiedUser = await JWT.verifyUserToken(token);
      const findUser = await User.findById(verifiedUser?.user_id);

      if (findUser?._id?.toString() !== user_id)
        res.status(STATUS_CODES.UN_AUTHORIZED).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.UN_AUTHORIZED_USER,
          }),
        );
      else return next();
    } catch (error) {
      serverError(error, res);
    }
  };
}
export default new MiddleWare();
