import { Request, Response, NextFunction } from "express";
import AuthService from "../../services/auth/auth.service";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({ success: true, message: "User registered successfully.", data: result, });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {

    const ACCESS_COOKIE_NAME = "access_token";
    const cookieOpts = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production" };

    try {
      const result = await AuthService.login(req.body);

      res.cookie(ACCESS_COOKIE_NAME, result.token, {
        ...cookieOpts, expires: result.expiresDate
      }).status(200).json({
        success: true,
        data: result,
        message: "Login successful.",
      })
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.refreshToken(req.body.refreshToken);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request,res: Response,next: NextFunction): Promise<void> {
    try {
      await AuthService.logout();

      res.status(200).json({
        success: true,
        message: "Logout successful.",
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await AuthService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();