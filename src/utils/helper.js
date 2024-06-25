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

  comparator = (a, b, orderBy) =>
    b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;

  applySortFilter = (array = [], key, orderBy) => {
    if (key && orderBy) {
      return array.sort((a, b) =>
        orderBy === "desc"
          ? this.comparator(a, b, key)
          : -this.comparator(a, b, key),
      );
    } else return array;
  };

  modifyObj = (obj = {}) => {
    if (!Object.keys(obj)?.length) return {};
    const object = {};
    Object.keys(obj).forEach((item) => {
      (object["key"] = item), (object["value"] = obj[item]);
    });
    return object;
  };

  paginate = (data = [], page_size = 10, page_number = 1) => {
    const parsedPageSize = parseInt(page_size) || 10;
    const parsedPage = parseInt(page_number) || 1;
    const offset = (parsedPage - 1) * parsedPageSize;
    const paginatedData = data.slice(offset, offset + parsedPageSize);
    return {
      paginatedData,
      pagination: {
        page: parsedPage,
        pageSize: parsedPageSize,
        total: data?.length,
      },
    };
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
                    Thanks!<br>Gross App
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

  thankyouEmail = (STORE_NAME) => {
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
       <!-- Content Section -->
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color: #fff; padding: 20px 0;">
         <tr>
            <td align="center" valign="middle" >
              <img src="https://nova-ecom.s3.amazonaws.com/thank-you.jpg" width="200px"  alt="Logo">
            </td>
          </tr>
          <tr>
            <td align="center" valign="middle">
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 16px; font-family: 'Open Sans', Helvetica, Arial, sans-serif; padding: 0 25px;">
                    <span style="font-size:25px"><strong>Your exceptional work<br/> in creating our online store is greatly appreciated.<br/><br/><span />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 16px; font-family: 'Open Sans', Helvetica, Arial, sans-serif; padding: 0 25px;">
                    <span>Hello,${STORE_NAME}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 16px; font-family: 'Open Sans', Helvetica, Arial, sans-serif; padding: 0 25px;">
                    Your exceptional talent in creating our website's store has not only transformed our online presence but also opened doors to endless opportunities.<br/> Thank you for turning our dreams into a digital reality!        <br/> <br/>
                 </td>          
                </tr>
                <tr>
                
               <td align="center" style="font-size: 16px; font-family: 'Open Sans', Helvetica, Arial, sans-serif; padding: 0 25px;">
                    I can't thank you enough for crafting an outstanding store on our website. <br />Your skills and dedication have not only enhanced our online presence but also boosted our business prospects.<br /> Here's to a successful journey ahead!
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 16px; font-family: 'Open Sans', Helvetica, Arial, sans-serif; padding: 0 25px;">
                  <br/>
                    Thanks!<br>Gross App
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

  sendResetEmail = async (recipientEmail, EmailFormat, titleMessage) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
          user: "urvashil.itpath@gmail.com",
          pass: "rjfhsbwlwtkihvey",
        },
      });

      const message = {
        from: "abc@gmail.com",
        to: recipientEmail,
        subject: titleMessage,
        html: EmailFormat,
      };

      const info = await transporter.sendMail(message);
    } catch (error) {
      console.error("Error sending reset email:", error);
    }
  };
}

export default new Helper();
