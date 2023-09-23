import { Router } from "express";
import ProductController from "../../controllers/products/index.js";
import Middlewares from "../../middlewares/index.js";
import AWS from "../../utils/aws.js";

const productRouter = Router();

// for store admin
productRouter.post(
  "/create-product",
  [
    Middlewares.authentication,
    AWS.S3("products").single("product_image"),
    Middlewares.onlyForStoreAdmin,
    Middlewares.isOwnStore,
  ],
  ProductController.createProduct,
);

productRouter.get("/get-products", ProductController.getAllProducts);

//for super admin
productRouter.post(
  "/admin/create-product",
  [
    Middlewares.authentication,
    AWS.S3("products").single("product_image"),
    Middlewares.isAdmin,
    Middlewares.isOwnStore,
  ],
  ProductController.createProduct,
);

export default productRouter;
