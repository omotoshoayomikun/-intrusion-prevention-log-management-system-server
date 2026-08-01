import fs from "fs/promises";
import type { Express } from "express";
import cloudinary from "../utils/cloudinary";
import logger from "../config/loggerConfig";
import { createError } from "../config/createError";

/**
 * Accepts either:
 *  - Express.Multer.File[]           (from upload.array("images"))
 *  - Record<string, Express.Multer.File[]> (from upload.fields(...))
 */

export const uploadMultipleImages = async (
  files: Express.Multer.File[] | Record<string, Express.Multer.File[]>
): Promise<{url: string, public_id: string}[]> => {
  // Normalize to an array
  const fileArray: Express.Multer.File[] = Array.isArray(files)
    ? files
    : (files?.images ??
       Object.values(files ?? {}).flat());

  if (!fileArray?.length) {
    logger.warn("uploadMultipleImages called with no files");
    return [];
  }

  logger.info(`Starting upload of ${fileArray.length} images`);

  try {
    const results = await Promise.all(
      fileArray.map(async (file) => {
        if (!file?.path) {
          // If this ever fires, you're on memoryStorage but calling .upload(file.path)
          throw createError(400, "File path missing; are you using memoryStorage?");
        }
        try {
          const res = await cloudinary.uploader.upload(file.path, {
            folder: "uploads",
            use_filename: true,
            unique_filename: true,
            resource_type: "image",
            overwrite: false,
          });
          logger.debug(`Uploaded image: ${res.secure_url}`);
          return {url: res.secure_url, public_id: res.public_id};
        } finally {
          // cleanup regardless of success/failure of this file’s upload
          try {
            await fs.unlink(file.path);
          } catch {
            /* ignore cleanup errors */
          }
        }
      })
    );

    logger.info(`Successfully uploaded ${results.length} images`);
    return results;
  } catch (err) {
    logger.error("Failed to upload multiple images to Cloudinary:", err);
    throw createError(400, "Failed to upload images; please try again");
  }
};


export const uploadSingleImage = async (file: Express.Multer.File): Promise<{url: string, public_id: string}> => {
  if (!file?.path) {
    throw createError(400, "File path missing; are you using memoryStorage?");
  }
  try {
    logger.info(`Starting upload of single image: ${file.path}`);
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "uploads",
      use_filename: true,
      unique_filename: true,
      resource_type: "image",
      overwrite: false,
    });
    logger.info(`Successfully uploaded single image: ${result.secure_url}`);
    return {url: result.secure_url, public_id: result.public_id};
  } catch (err) {
    logger.error("Failed to upload single image to Cloudinary:", err);
    throw createError(400, "Failed to upload single image; please try again");
  } finally {
    try {
      await fs.unlink(file.path);
    } catch {
      /* ignore cleanup errors */
    }
  }
};
