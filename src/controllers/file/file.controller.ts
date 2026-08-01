import { NextFunction, Request, Response } from "express";
import { createError } from "../../config/createError";
import { uploadSingleDocument } from "../../helpers/documentUploader";
import File from "../../models/file.model";
import { parseQueryParams } from "../../utils/queryParams";
// removed unused import that conflicted with local `file` variable


export const UploadFileController = async (req: Request, res: Response, next: NextFunction) => {

    const user_id = req.user?._id
    const file = req.file

    try {
        if (!req.file) {
            return createError(400, 'Please upload a file.');
        }
        const uploadedFile = await uploadSingleDocument(req.file);

        if (!uploadedFile) {
            return createError(400, 'Error Uploading Image.');
        }

        const saveFile = await File.create({
            userId: user_id as any,
            originalName: file?.originalname,
            fileName: file?.filename,
            mimeType: file?.mimetype,
            extension: file?.filename?.split('.').pop()?.toLowerCase() || "",
            size: file?.size,
            url: uploadedFile?.url,
            cloudinaryId: uploadedFile?.public_id
        })

        res.status(200).json({
            success: true, data: saveFile, message: "File uploaded successfully."
        })


    } catch (error) {
        next(error)
    }
}

export const GetAllFilesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;

        const queryParams = parseQueryParams(req);
        const { page, limit, search, sortBy, sortOrder} = queryParams;
        const skip = (page - 1) * limit;

        // 2. Build Query Filter
        const queryFilter: Record<string, any> = { userId };

        if (search) {
            queryFilter.originalName = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        // 3. Execute DB Queries in Parallel
        const [files, totalFiles] = await Promise.all([
            File.find(queryFilter)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            File.countDocuments(queryFilter),
        ]);

        const totalPages = Math.ceil(totalFiles / limit);

        // 4. Send Response
        res.status(200).json({
            success: true,
            message: "Files retrieved successfully.",
            data: {
                files,
                pagination: {
                    totalFiles,
                    totalPages,
                    currentPage: page,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const AdminGetFileController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const queryParams = parseQueryParams(req);
        const { page, limit, search, sortBy, sortOrder} = queryParams;
        const skip = (page - 1) * limit;

        // 2. Build Query Filter
        const queryFilter: Record<string, any> = { };

        if (search) {
            queryFilter.originalName = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        // 3. Execute DB Queries in Parallel
        const [files, totalFiles] = await Promise.all([
            File.find(queryFilter)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean()
                .populate("userId", "_id firstname lastname") 
                ,
            File.countDocuments(queryFilter),
        ]);

        const totalPages = Math.ceil(totalFiles / limit);

        // 4. Send Response
        res.status(200).json({
            success: true,
            message: "Files retrieved successfully.",
            data: {
                files,
                pagination: {
                    totalFiles,
                    totalPages,
                    currentPage: page,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const GetSingleFileController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        // 1. Fetch file checking both File ID and User ownership
        const file = await File.findOne({ _id: id }).lean();

        if (!file) {
            return next(createError(404, "File not found or access denied."));
        }

        // 2. Send Response
        res.status(200).json({
            success: true,
            message: "File retrieved successfully.",
            data: file,
        });
    } catch (error) {
        next(error);
    }
};