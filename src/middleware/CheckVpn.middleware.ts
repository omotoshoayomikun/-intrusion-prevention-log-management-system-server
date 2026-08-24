import { NextFunction, Request, Response } from "express";
import { getClientIp } from "../config/getClientIp";
import { checkVpn } from "../config/checkVpn";

const ALLOWED_COUNTRY = "NG";

const vpnDetectionMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const ip = getClientIp(req);

        const result = await checkVpn(ip);

        const country = req.geo?.country;

        const isOutsideNigeria =
            country !== undefined &&
            country !== null &&
            country !== ALLOWED_COUNTRY;

        req.security = {
            ...req.security,

            vpnDetected: result.isVpn,

            ip,

            country,

            foreignCountry: isOutsideNigeria,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export default vpnDetectionMiddleware;