const STATUS_CODES = {
  CREATED: 201,
  SUCCESS: 200,
  REDIRECT: 302,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const TYPES = {
  SUCCESS: "success",
  ERROR: "error",
};

const MASTER_ACCESS = "Ronak@2001";

const RESPONSE_MESSAGES = {
  SERVER_ERROR: "Something went wrong.",
  UN_AUTHORIZED_USER: "Unauthorized user.",
  PROVIDE_TOKEN: "Provide token.",
  INVALID_TOKEN: "Invalid token.",
  NOT_FOUND: "Data not found.",
  INVALID_ID: "Invalid id.",
  REQUIRED: "All fields are required.",
};

const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  STORE_ADMIN: "store_admin",
};

export { STATUS_CODES, TYPES, MASTER_ACCESS, RESPONSE_MESSAGES, USER_ROLES };
