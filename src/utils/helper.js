import crypto from "crypto";
import { Types } from "mongoose";

class Helper {
  allFieldsAreRequired = (data = []) => {
    if (!data?.length) return true;
    const cloneData = [...data];
    return cloneData?.some(
      (fields) =>
        fields === undefined ||
        fields === "" ||
        String(fields).trim() === "" ||
        fields?.length === 0
    );
  };

  allFieldsAreNotRequired = (fields) => {
    const obj = {};
    Object.keys(fields).forEach((val) => {
      if (val !== undefined && !!fields[val]) {
        obj[val] = fields[val];
      }
    });
    return obj;
  };

  isAllObjectId = (data = []) => {
    if (!data?.length) return true;
    const cloneData = [...data];
    return cloneData.every((val) => this.isValidObjectId(val));
  };

  isValidObjectId = (id) => Types.ObjectId.isValid(id);

  uniqueId = (size) => {
    const MASK = 0x3d;
    const LETTERS = "abcdefghijklmnopqrstuvwxyz";
    const NUMBERS = "1234567890";
    const charset = `${NUMBERS}${LETTERS}${LETTERS.toUpperCase()}`.split("");
    const bytes = new Uint8Array(size);
    crypto.webcrypto.getRandomValues(bytes);
    return bytes.reduce((acc, byte) => `${acc}${charset[byte & MASK]}`, "");
  };

  removeField = (fields = [], body = {}) => {
    if (!Object.keys(body)?.length) return {};
    const cloneFields = [...fields];
    const filteredResponse = { ...body };
    cloneFields.forEach((data) => {
      if (data in body) {
        delete filteredResponse[data];
      }
    });
    return filteredResponse;
  };

  groupingObj = (data = {}, key) => {
    if (!key || !Object.keys(data).length) return {};
    return {
      [key]: {
        ...data,
      },
    };
  };

  sorting = (data, params) => {
    if (params == "asc") return data.sort((a, b) => a.price - b.price);

    if (params == "desc") return data.sort((a, b) => b.price - a.price);
  };
}

export default new Helper();
