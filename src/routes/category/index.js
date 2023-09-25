import { Router } from "express";
import Middlewares from "../../middlewares/index.js";
import CategoryController from "../../controllers/category/index.js";
import AWS from '../../utils/aws.js'

const categoryRouter = Router();

categoryRouter.post(
  "/add-category",
  [
    Middlewares.authentication,
    AWS.S3("category").single("image"),
    Middlewares.isOwn,
    Middlewares.isOwnStore
  ],
  CategoryController.addNewCategory,
);

categoryRouter.put(
  "/update-category/:_id",
  [
    Middlewares.authentication,
    Middlewares.isValidObjectId,
    AWS.S3("category").single("image"),
    Middlewares.isOwn,
    Middlewares.isOwnStore
  ],
  CategoryController.updateCategory
)

categoryRouter.delete(
  "/delete-category/:_id",
  [
    Middlewares.authentication,
    Middlewares.isValidObjectId,
    Middlewares.isOwnStore,
  ],
  CategoryController.deleteCategory,
);

categoryRouter.get("/get-category", CategoryController.getAllCategory);

//admin
categoryRouter.post(
  "/admin/add-category",
  [Middlewares.authentication, Middlewares.isAdmin],
  CategoryController.addNewCategory,
);
categoryRouter.delete(
  "/admin/delete-category/:_id",
  [Middlewares.authentication, Middlewares.isAdmin],
  CategoryController.deleteCategory,
);

export default categoryRouter;
