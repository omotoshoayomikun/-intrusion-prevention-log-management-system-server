import { Router } from "express"
import upload from "../../utils/multer";
import * as FileController from "../../controllers/file/file.controller"
import { verifyToken, verifyAdmin } from "../../middleware/verifyToken";

const router = Router();

router.post("/upload", verifyToken, upload.single("document"), FileController.UploadFileController)
router.get("/files", verifyToken, FileController.GetAllFilesController)
router.get("/file", verifyToken, FileController.GetSingleFileController)
router.get("/admin-get-file", verifyAdmin, FileController.AdminGetFileController)


export default router;