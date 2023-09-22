import { Router } from "express";
import MiddleWares from "../../middlewares/index.js";
import CartController from "../../controllers/cart/index.js";

const cartRouter = Router();

cartRouter.post(
  "/cart/add",
  [MiddleWares.authentication, MiddleWares.isOwn],
  CartController.addToCart
);
cartRouter.delete(
  "/cart/remove",
  [MiddleWares.authentication, MiddleWares.isOwn],
  CartController.removeCartProduct
);
cartRouter.get(
  "/cart",
  [MiddleWares.authentication, MiddleWares.isOwn],
  CartController.getAllCart
);

export default cartRouter;
