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
  "/cart/remove/:_id",
  [MiddleWares.authentication],
  CartController.removeCartProduct
);
cartRouter.get(
  "/cart",
  [MiddleWares.authentication, MiddleWares.isOwn],
  CartController.getAllCart
);

cartRouter.patch(
  "/cart/edit",
  [MiddleWares.authentication],
  CartController.editCart
);
export default cartRouter;
