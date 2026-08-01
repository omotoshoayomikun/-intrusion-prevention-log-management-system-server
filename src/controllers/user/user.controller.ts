import { NextFunction, Request, Response } from "express";
import { parseQueryParams } from "../../utils/queryParams";
import User from "../../models/user.model";

export const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryParams = parseQueryParams(req);
        const { page, limit, search, sortBy, sortOrder } = queryParams;
        const skip = (page - 1) * limit;

        const queryFilter: Record<string, any> = {};

        if (search) {
            queryFilter.originalName = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        const [users, totalFiles] = await Promise.all([
            User.find(queryFilter)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(queryFilter),
        ]);

        const totalPages = Math.ceil(totalFiles / limit);

        res.status(200).json({
            success: true,
            message: "Files retrieved successfully.",
            data: {
                users,
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
        next(error)
    }
}