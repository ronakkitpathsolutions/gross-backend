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

storeRouter.put(
  "/update-store",
  [
    Middlewares.authentication,
    AWS.S3("stores").fields([
      { name: "store_banner", maxCount: 1 },
      { name: "store_image", maxCount: 1 },
    ]),
    Middlewares.isOwnStore,
  ],
  StoreController.editStore,
);

storeRouter.get("/stores/:_id", StoreController.getStoreById);

storeRouter.delete(
  "/remove-store",
  [Middlewares.onlyForStoreAdmin, Middlewares.isOwnStore],
  StoreController.removeStore,
);

storeRouter.get("/getstore", StoreController.getStore);

export default storeRouter;
