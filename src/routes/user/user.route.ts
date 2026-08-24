import {Router} from "express"
import * as userController from "../../controllers/user/user.controller";
import { verifyAdmin, verifyToken } from "../../middleware/verifyToken";

const router = Router()

router.get("/all-users", verifyAdmin, userController.GetAllUsers)
router.get(
    "/dashboard",
    verifyToken,
    userController.getUserDashboardController
);



export default router