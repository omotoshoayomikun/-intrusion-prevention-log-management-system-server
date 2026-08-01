import { Schema, model } from "mongoose";
import { IUser } from "../utils/types";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

const UserSchema = new Schema<IUser>(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },

        email: {
            type: String,
            unique: true,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER
        },

        lastLogin: {
            type: Date
        },

        isActive: {
            type: Boolean,
            default: true
        }

    }, {
    timestamps: true
});

const User = model<IUser>("User", UserSchema)

export default User;