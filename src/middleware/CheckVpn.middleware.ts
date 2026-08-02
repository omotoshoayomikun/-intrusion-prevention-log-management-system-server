import { NextFunction, Request, Response } from "express";
import { getClientIp } from "../config/getClientIp";
import { checkVpn } from "../config/checkVpn";

const vpnDetectionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = getClientIp(req);

    const result = await checkVpn(ip);

     req.security = {
        ...req.security,
        vpnDetected: result.isVpn,
        // vpnProvider: result.provider ?? null,
        ip,
    };

    next();
};

export default vpnDetectionMiddleware;