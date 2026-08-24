import { NextFunction, Request, Response } from "express";
import { parseQueryParams } from "../../utils/queryParams";
import User from "../../models/user.model";
import userService from "../../services/user/user.service";

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


export const getUserDashboardController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const dashboard = await userService.getDashboard(userId.toString());

        return res.status(200).json({
            success: true,
            message: "User dashboard retrieved successfully.",
            data: dashboard,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch user dashboard.",
        });
    }
};