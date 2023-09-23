import { Router } from "express";
import Middlewares from "../../middlewares/index.js";
import StoreController from "../../controllers/store/index.js";
import AWS from "../../utils/aws.js";

const storeRouter = Router();

storeRouter.post(
  "/create-store",
  [
    Middlewares.authentication,
    AWS.S3("stores").fields([
      { name: "store_banner", maxCount: 1 },
      { name: "store_image", maxCount: 1 },
    ]),
    Middlewares.onlyForStoreAdmin,
  ],
  StoreController.createStore,
);

export default storeRouter;
