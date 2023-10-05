import crypto from "crypto";
import { Types } from "mongoose";
import nodemailer from "nodemailer";

class Helper {
  allFieldsAreRequired = (data = []) => {
    if (!data?.length) return true;
    const cloneData = [...data];
    return cloneData?.some(
      (fields) =>
        fields === undefined ||
        fields === "" ||
        String(fields).trim() === "" ||
        fields?.length === 0,
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

    if (params == "byname")
      return data.sort((a, b) => a.product_name.localeCompare(b.product_name));
  };

  resetEmailFormat = (PASSWORD_RESET_LINK) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <style>
         /* Add any additional CSS styles here if needed */
      </style>
    </head>
    <body style="background-color: #fafbfc; margin: 0; padding: 0;">
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
    <tr>
      <td style="padding: 20px;">
        <!-- Logo Section -->
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <td align="center" valign="middle" style="padding: 25px;">
              <img src="https://uploads-ssl.webflow.com/5f059a21d0c1c3278fe69842/5f188b94aebb5983b66610dd_logo-arengu.png" width="125px" alt="Logo">
            </td>
          </tr>
        </table>

        <!-- Content Section -->
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color: #fff; padding: 20px 0;">
          <tr>
            <td align="center" valign="middle">
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 16px; font-family: 'Open Sans', Helvetica, Arial, sans-serif; padding: 0 25px;">
                    <span>Hello,</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 16px; font-family: 'Open Sans', Helvetica, Arial, sans-serif; padding: 0 25px;">
                    You have requested us to send a link to reset your password for your Arengu account.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 25px;">
                    <a href="${PASSWORD_RESET_LINK}" style="font-size: 18px; background-color: #20c5a0; border-radius: 8px; color: #fff; text-decoration: none; display: inline-block; padding: 10px 20px; font-family: 'Open Sans', Helvetica, Arial, sans-serif;">Reset password</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 16px; font-family: 'Open Sans', Helvetica, Arial, sans-serif; padding: 0 25px;">
                    If you didn't initiate this request, you can safely ignore this email.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 16px; font-family: 'Open Sans', Helvetica, Arial, sans-serif; padding: 0 25px;">
                    Thanks!<br>Arengu team
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    </table>
    </body>
    </html>`;
  };

  sendResetEmail = async (recipientEmail, resetEmailFormat) => {
    try {
      // Create a transporter using your email service provider's SMTP settings
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false, // Set to true if using a secure connection (e.g., SSL/TLS)
        auth: {
          user: "urvashil.itpath@gmail.com",
          pass: "rjfhsbwlwtkihvey",
        },
      });

      // Compose the email message
      const message = {
        from: "abc@gmail.com",
        to: recipientEmail,
        subject: "Password Reset",
        html: resetEmailFormat,
      };

      // Send the email
      const info = await transporter.sendMail(message);
    } catch (error) {
      console.error("Error sending reset email:", error);
    }
  };
}

export default new Helper();
