import { Router } from "express";
import AuthController from "../../controllers/auth/index.js";
import MiddleWares from "../../middlewares/index.js";
import AWS from "../../utils/aws.js";

const authRouter = Router();

authRouter.post("/user/create", AuthController.createUser);
authRouter.post("/user/login", AuthController.loginUser);
authRouter.put(
  "/user/change-password",
  [MiddleWares.authentication, MiddleWares.getAccessByUserId],
  AuthController.resetPassword
);
authRouter.get(
  "/profile/:_id",
  [
    MiddleWares.authentication,
    MiddleWares.getAccessByUserId,
    MiddleWares.isValidObjectId,
  ],
  AuthController.getProfile
);
authRouter.put(
  "/profile/:_id",
  [
    MiddleWares.authentication,
    MiddleWares.getAccessByUserId,
    MiddleWares.isValidObjectId,
    AWS.S3("profiles").single("profile"),
  ],
  AuthController.updateProfile
);

authRouter.post(
  "/admin/master-access",
  [MiddleWares.authentication, MiddleWares.isAdmin],
  AuthController.masterLogin
);

export default authRouter;
