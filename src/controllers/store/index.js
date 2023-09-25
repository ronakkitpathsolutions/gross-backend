import Store from "../../models/store/index.js";
import dotenv from "dotenv";
import Helper from "../../utils/helper.js";
import {
  RESPONSE_MESSAGES,
  STATUS_CODES,
  TYPES,
} from "../../utils/constant.js";
import { response, serverError } from "../../utils/functions.js";
import mongoose from "mongoose";

class StoreController {
  constructor() {
    dotenv.config();
  }

  createStore = async (req, res) => {
    try {
      const {
        user_id,
        store_name,
        contact,
        city,
        state,
        street,
        country,
        pin_code,
        ...body
      } = req.body;

      const { store_image, store_banner } = req.files;

      const isAllFieldRequired = Helper.allFieldsAreRequired([
        user_id,
        store_name,
        contact,
        city,
        state,
        street,
        country,
        pin_code,
      ]);
      if (isAllFieldRequired)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.REQUIRED,
          })
        );

      const isAllObjectId = Helper.isAllObjectId([user_id]);
      if (!isAllObjectId)
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          response({
            type: TYPES.ERROR,
            message: RESPONSE_MESSAGES.INVALID_ID,
          })
        );

      const data = new Store({
        user_id,
        store_name,
        address: {
          city,
          state,
          street,
          country,
          pin_code,
        },
        info: {
          contact,
          email: body?.email,
        },
        store_image: store_image?.length
          ? store_image?.map((val) => val?.location)?.toString()
          : null,
        store_banner: store_banner?.length
          ? store_banner?.map((val) => val?.location)?.toString()
          : null,
      });

      const storeData = await data.save();

      return res.status(STATUS_CODES.CREATED).json(
        response({
          type: TYPES.SUCCESS,
          data: storeData,
        })
      );
    } catch (error) {
      serverError(error, res);
    }
  };

  getAllStores = async (req, res) => {
    try {
      const data = await Store.find().select({
        __v: 0,
        created_At: 0,
        store_banner: 0,
        user_id: 0,
        store_banner: 0,
      });
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

  editStore = async (req, res) => {
    try {

      const { store_image, store_banner } = req.files;
      const { store_id, user_id, country, street, pin_code, state, city, email, contact, store_name } = req.body

      const currentData = await Store.findOne({ _id: new mongoose.Types.ObjectId(store_id), user_id })

      const { info, address } = currentData

      await Store.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(store_id), user_id }, {
        store_name,
        store_image: store_image?.length ? store_image?.map((val) => val?.location)?.toString() : currentData?.store_image,
        store_banner: store_banner?.length ? store_banner?.map((val) => val?.location)?.toString() : currentData?.store_banner,
        address: { ...address, ...Helper.allFieldsAreNotRequired({ country, street, pin_code, state, city }) },
        info: { ...info, ...Helper.allFieldsAreNotRequired({ email, contact }) }
      })

      const data = await Store.findOne({ _id: new mongoose.Types.ObjectId(store_id), user_id })

      if (!data) return res.status(STATUS_CODES.NOT_FOUND).json(
        response({
          type: TYPES.ERROR,
          message: RESPONSE_MESSAGES.NOT_FOUND
        })
      )

      return res.status(STATUS_CODES.SUCCESS).json(response({
        type: TYPES.SUCCESS,
        data
      }))

    } catch (error) {
      serverError(error, res)
    }
  }

}

export default new StoreController();
