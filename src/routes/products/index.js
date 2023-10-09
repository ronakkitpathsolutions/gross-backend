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
productRouter.get("/get-product/:_id", ProductController.getProductById);
productRouter.delete(
  "/remove-product/:_id",
  [
    Middlewares.authentication,
    Middlewares.onlyForStoreAdmin,
    Middlewares.isOwnStore,
  ],
  ProductController.removeProductById,
);

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
productRouter.delete(
  "/admin/remove-product/:_id",
  [Middlewares.authentication, Middlewares.isAdmin, Middlewares.isOwnStore],
  ProductController.removeProductById,
);

productRouter.get("/search-product", ProductController.searchProduct);

export default productRouter;
