import File from "../../models/file.model";
import { createError } from "../../config/createError";
import { Types } from "mongoose";

class FileService {
  async deleteFile(fileId: string, userId: string) {
    if (!Types.ObjectId.isValid(fileId)) {
      throw createError(400, "Invalid file ID.");
    }

    const file = await File.findOne({
      _id: fileId,
      userId: userId,
      isDeleted: false,
    });

    if (!file) {
      throw createError(
        404,
        "File not found or you do not have permission to delete it."
      );
    }

    // Soft delete
    file.isDeleted = true;
    file.deletedAt = new Date();

    await file.save();

    return file;
  }
}

export default new FileService();