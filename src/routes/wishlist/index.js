import { Router } from "express";
import Middlewares from "../../middlewares/index.js";
import WishlistController from "../../controllers/wishlist/index.js";

const wishlistRouter = Router();

wishlistRouter.post(
    "/wishlist",
    [Middlewares.authentication],
    WishlistController.addToWishlist
);
wishlistRouter.put(
    "/wishlist",
    [Middlewares.authentication],
    WishlistController.removeWishlist
);
wishlistRouter.get(
    "/wishlist",
    [Middlewares.authentication],
    WishlistController.getWishlist
);

export default wishlistRouter;
