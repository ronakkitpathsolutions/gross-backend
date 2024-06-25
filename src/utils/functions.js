import { RESPONSE_MESSAGES, STATUS_CODES, TYPES } from "./constant.js";

const response = ({ type, error, data, message, ...fields }) => {
  const object = { type, error, data, message };
  if (!error || !!data) delete object[error];
  if (!data || !!error) delete object[data];
  if (!message) delete object[message];
  return { ...object, ...fields };
};

const serverError = (error, res) =>
  res.status(STATUS_CODES.SERVER_ERROR).json(
    response({
      type: TYPES.ERROR,
      message: error?.message || RESPONSE_MESSAGES.SERVER_ERROR,
    }),
  );

const createObject = (array = []) => {
  if (!array?.length) return {};
  return array.reduce((prev, current) => {
    return Object.assign(prev, { [current]: current });
  }, {});
};

export { serverError, response, createObject };
