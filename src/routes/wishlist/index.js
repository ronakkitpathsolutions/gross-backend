import { Router } from "express";
import Middlewares from "../../middlewares/index.js";
import WishlistController from "../../controllers/wishlist/index.js";

const wishlistRouter = Router();

wishlistRouter.post(
  "/wishlist/add",
  [Middlewares.authentication, Middlewares.isOwn],
  WishlistController.addToWishlist,
);
wishlistRouter.delete(
  "/wishlist/remove/:_id",
  [Middlewares.authentication],
  WishlistController.removeWishlist,
);
wishlistRouter.get(
  "/wishlist",
  [Middlewares.authentication, Middlewares.isOwn],
  WishlistController.getWishlist,
);

export default wishlistRouter;
