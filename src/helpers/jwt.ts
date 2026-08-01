import { createError } from "../config/createError";
import logger from "../config/loggerConfig";
import { env } from "../utils/env";
import  User  from "../models/user.model";
import jwt from "jsonwebtoken";


export const generateUserToken = async (user: any) => {
    try {
        logger.info("Generating token for user:", user._id);

         const payload = {
            _id: user._id.toString(), // Convert ObjectId to string
            isActive: user.isActive, // Include only necessary fields
            role: user.role,
        };

        const token = jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: "8h"
        })
        logger.info(`Successfully generated token for user: ${user._id}`);
        return token;

    }
    catch (error) {
        logger.error(`Error creating user token: ${error}`);
        return createError(500, "Failed to generate token");
    }
}

export const decodeUserToken = async (token: string) => {
    try {
        const decode = jwt.verify(token, env.JWT_SECRET) as any;
        //as { id: string, isAdmin: boolean };

        if (!decode._id) {
            logger.warn("Invalid token: No user ID found")
            return createError(401, "Invalid token");
        }

        logger.info(`Find user with ID: ${decode._id} from token`);
        const associatedUser = await User.findById(decode._id);
        //.select("-password");

        if (!associatedUser) {
            logger.warn(`User not found for token: ${decode.id}`);
            return createError(404, "User not found");
        }

      //  logger.info(`Successfully decoded token and found user: ${associatedUser?._id}`);
        return associatedUser;


    } catch (error) {
        logger.error(`Error decoding user token: ${error}`);
        return createError(500, "Failed to decode token");
    }
}