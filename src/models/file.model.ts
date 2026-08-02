import { Schema, model } from "mongoose";
import { BaseSchemaOptions } from "./base.model";
import { IFile } from "../utils/types";

const FileSchema = new Schema<IFile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        originalName: { type: String, required: true, trim: true },
        fileName: { type: String, required: true, trim: true },
        mimeType: { type: String, required: true },
        extension: { type: String, required: true, lowercase: true },
        size: { type: Number, required: true, },
        cloudinaryId: { type: String, required: true, unique: true },
        url: { type: String, required: true },
        uploadedByIp: { type: String, default: null },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    BaseSchemaOptions
);

/**
 * Indexes
 */

FileSchema.index({
    userId: 1,
    createdAt: -1,
});

FileSchema.index({
    mimeType: 1,
});

FileSchema.index({
    extension: 1,
});


const File = model<IFile>("File", FileSchema);

export default File;