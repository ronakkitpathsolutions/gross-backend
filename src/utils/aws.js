import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
  region: process.env.BUCKET_REGION,
});

class AWS {
  constructor() {
    dotenv.config();
  }
  S3 = (folderPath = "") => {
    return multer({
      storage: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME || "",
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, callback) =>
          callback(null, { fieldName: file.originalname }),
        key: (req, file, callback) =>
          callback(null, `${folderPath}/${file.originalname}`),
      }),
    });
  };
}

export default new AWS();
