import { Router } from "express";
import MiddleWares from "../../middlewares/index.js";
import RolesController from "../../controllers/roles/index.js";

const rolesRouter = Router();

rolesRouter.post(
  "/create-roles",
  [MiddleWares.authentication, MiddleWares.isAdmin],
  RolesController.createRoles,
);

rolesRouter.delete(
  "/remove-roles/:_id",
  [MiddleWares.authentication, MiddleWares.isAdmin],
  RolesController.removeRoles,
);

rolesRouter.get(
  "/roles",
  [MiddleWares.authentication, MiddleWares.isAdmin],
  RolesController.getAllRoles,
);

rolesRouter.put(
  "/edit-roles/:_id",
  [MiddleWares.authentication, MiddleWares.isAdmin],
  RolesController.editRoles,
);

export default rolesRouter;
