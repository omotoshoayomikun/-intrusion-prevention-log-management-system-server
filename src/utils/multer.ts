import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "./env";
import { randomUUID } from "crypto"

const isProduction = process.env.NODE_ENV === 'production';

const uploadPath = isProduction ? path.join('/tmp', env.UPLOAD_PATH) : path.join(__dirname, env.UPLOAD_PATH);

// define the storage configuration but delay directory creation until needed
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // ensure the directory exists at runtime
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${req.user?._id}-${Date.now()}-${randomUUID()}${ext}}`);
    }
});


const fileFilter: multer.Options["fileFilter"] = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
): void => {
    const ext = path.extname(file.originalname).toLowerCase();
    const okExt = [".jpg", ".jpeg", ".png"].includes(ext);
    const okMime = file.mimetype.startsWith("image/");


    if (!okExt || !okMime) {
        const err = new Error("Wrong format | Please upload .jpg, .jpeg, or .png.") as any;
        err.code = "INVALID_FILE_TYPE";
        return cb(err);
    }

    cb(null, true);

    // if (!(extension === ".jpg" || extension === ".jpeg" || extension === ".png")) {
    //     const error: any = {
    //         code: "INVALID_FILE_TYPE",
    //         message: "Wrong format | Please upload an image with one of the following formats: .jpg, .jpeg, or .png.",
    //     };
    //     cb(new Error(error));
    //     return;
    // }
};

const upload = multer({
    storage,
    fileFilter,
});

export default upload;
