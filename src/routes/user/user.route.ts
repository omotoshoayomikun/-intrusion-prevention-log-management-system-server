import {Router} from "express"
import * as userController from "../../controllers/user/user.controller";
import { verifyAdmin } from "../../middleware/verifyToken";

const router = Router()

router.get("/all-users", verifyAdmin, userController.GetAllUsers)



export default router