import { Router } from "express";
import Middlewares from "../../middlewares/index.js";
import AWS from "../../utils/aws.js";
import SubCategoryController from "../../controllers/sub-category/index.js";

const subCategoryRouter = Router();

subCategoryRouter.post(
  "/create-sub-category",
  [
    Middlewares.authentication,
    AWS.S3("sub-category").single("image"),
    Middlewares.isOwnStore,
  ],
  SubCategoryController.createSubCategory,
);

subCategoryRouter.get(
  "/sub-category/:_id",
  [Middlewares.isValidObjectId],
  SubCategoryController.getAllSubCategory,
);

export default subCategoryRouter;
