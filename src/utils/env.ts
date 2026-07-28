import dotenv from "dotenv";

dotenv.config();

export const env = {
    MONGODB_URL: process.env.MONGODB_URL || "",
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 4110,
    JWT_SECRET: process.env.JWT_SECRET || "",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    UPLOAD_PATH: process.env.UPLOAD_PATH || '',
    BASEURL: process.env.BASEURL || 'http://localhost:4110/',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
    TRANSPORTER_EMAIL: process.env.TRANSPORTER_EMAIL || "",
    TRANSPORTER_PASSWORD: process.env.TRANSPORTER_PASSWORD || "",
}