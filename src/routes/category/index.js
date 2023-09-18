import { Router } from "express";
import Middlewares from "../../middlewares/index.js";
import CategoryController from "../../controllers/category/index.js";

const categoryRouter = Router();

categoryRouter.post(
    "/add-category/:_id",
    [
        Middlewares.authentication,
        Middlewares.isValidObjectId,
        Middlewares.getAccessForStoreAdminAndAdmin,
    ],
    CategoryController.addNewCategory
);
categoryRouter.delete(
    "/delete-category/:_id",
    [
        Middlewares.authentication,
        Middlewares.isValidObjectId,
        Middlewares.isStoreAdmin
    ],
    CategoryController.deleteCategory
)

categoryRouter.get('/get-category', CategoryController.getAllCategory)


//admin
categoryRouter.post(
    "/admin/add-category",
    [Middlewares.authentication, Middlewares.isAdmin],
    CategoryController.addNewCategory
);
categoryRouter.delete(
    "/admin/delete-category/:_id",
    [Middlewares.authentication, Middlewares.isAdmin],
    CategoryController.deleteCategory
);

export default categoryRouter;
