import { Router } from "express"
import upload from "../../utils/multer";
import * as FileController from "../../controllers/file/file.controller"
import { verifyToken, verifyAdmin } from "../../middleware/verifyToken";
import { securityMiddleware } from "../../utils/app";

const router = Router();

router.post("/upload", verifyToken,upload.single("document"), ...securityMiddleware, FileController.UploadFileController)
router.get("/files", verifyToken, ...securityMiddleware, FileController.GetAllFilesController)
router.get("/file", verifyToken, ...securityMiddleware, FileController.GetSingleFileController)
router.get("/admin-get-files", ...securityMiddleware, verifyAdmin, FileController.AdminGetFileController)


export default router;