import { createError } from "../../config/createError";
import { compareBcrptHash, createBcryptHash } from "../../helpers/bcrypt";
import { generateUserToken } from "../../helpers/jwt";
import User from "../../models/user.model"

class AuthService {
    async register(payload: any) {
        const { firstname, lastname, email, password } = payload;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createError(404, "Email already exists.")
        }
        const hashedPassword = await createBcryptHash(password);
        const user = await User.create({ firstname, lastname, email, password: hashedPassword, });
        return {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
        };
    }

    async login(payload: any) {
        const { email, password } = payload;
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(400, "Invalid email or password.");
        }
        if (!user.isActive) {
            throw createError(400, "Account has been disabled.");
        }
        const isPasswordCorrect = await compareBcrptHash(password, user.password);
        if (!isPasswordCorrect) {
            throw createError(400, "Invalid email or password.");
        }
        user.lastLogin = new Date();
        await user.save();

        /**
         * JWT will be added later.
         */

        const token = await generateUserToken(user)
        const expiresDate = new Date(Date.now() + 8 * 60 * 60 * 1000);

        return {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            token,
            expiresDate
        };
        
    }

    async refreshToken(token: string) {
        /**
         * Will be implemented after JWT.
         */

        return {};
    }

    async logout() {
        /**
         * Stateless JWT
         * Nothing to do for now.
         */

        return;
    }

    async getProfile(userId: string) {
        return User.findById(userId).select("-password");
    }
}

export default new AuthService();