import { Router } from "express";
import Middlewares from "../../middlewares/index.js";
import AddressController from "../../controllers/add-address/index.js";

const addressRouter = Router();
addressRouter.post(
  "/add-address",
  [Middlewares.authentication],
  AddressController.addAddress,
);

addressRouter.delete(
  "/remove-address/:address_id",
  [Middlewares.authentication],
  AddressController.deleteAddress,
);

addressRouter.get(
  "/get-all-address/:user_id",
  [Middlewares.authentication],
  AddressController.getUserAddress,
);

addressRouter.get("/get-address", AddressController.getAllAddress);

addressRouter.put(
  "/update-address/:address_id",
  [Middlewares.authentication],
  AddressController.editAddress,
);

export default addressRouter;
