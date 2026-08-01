import type { Request, Response, NextFunction } from "express";
import logger from "../config/loggerConfig";
import { createError } from "../config/createError";
import { decodeUserToken } from "../helpers/jwt";
import { IUser } from "../utils/types";


// export interface AuthedRequest extends Request { userId?: string }
// export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
//     const id = req.header("x-user-id");
//     if (!id) return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
//     req.userId = id;
//     next();
// }

declare module 'express-serve-static-core' {
    interface Request {
        user?: IUser;
        token?: string;
    }
}


export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookieToken = req.cookies.access_token;
        const authHeader = req.headers.authorization;
        const headerToken = authHeader && authHeader.split(" ")[1];

        const token = cookieToken || headerToken;

        if (!token) {
            logger.warn("Authentication token is missing.");
            return next(createError(401, "Access denied. No token provided."));
        }

        const currentUser = await decodeUserToken(token as string)
        if (!currentUser) {
            logger.warn("Invalid authentication token.");
            return next(createError(401, "Invalid token."));
        }
        req.user = currentUser as IUser;
        next();

    } catch (error) {
        next(error);
    }
}


export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await verifyToken(req, res, async () => {
            if (req.user?._id.toString() === req.params?.id as string || req.user?.role === "admin") {
                next();
            } else {
                logger.warn(`User ${req.user?._id} is not authorized to access this resource.`);
                return next(createError(403, "You are not authorized to access this resource."));
            }
        })
    } catch (error) {
        next(error);
    }
}

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await verifyToken(req, res, async () => {
            if (req.user?.role === "admin") {
                next();
            } else {
                logger.warn(`User ${req.user?._id} is not authorized to access this resource.`);
                return next(createError(403, "You are not authorized to access this resource."));
            }
        })
    } catch (error) {
        next(error);
    }
}