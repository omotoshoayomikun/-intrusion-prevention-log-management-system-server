import { NextFunction, Request, Response } from "express";
import { getClientIp } from "../config/getClientIp";
import SecurityLog from "../models/log.model";
import { UAParser } from "ua-parser-js";
import logger from "../config/loggerConfig";
import { v4 as uuid } from "uuid";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const parser = new UAParser(req.headers["user-agent"]);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();
    const user_id = req.user?._id ? req.user?._id : null
    const requestId = uuid();

    req.requestId = requestId;
    // Capture request information here
    const ip = getClientIp(req);

    res.on("finish", async () => {
        const responseTime = Date.now() - startTime;

        try {


            await SecurityLog.create({
                userId: user_id,
                ipAddress: ip,
                country: req.geo?.country,
                region: req.geo?.region,
                city: req.geo?.city,
                latitude: req.geo?.latitude,
                longitude: req.geo?.longitude,
                method: req.method,
                endpoint: req.path,
                statusCode: res.statusCode,
                responseTime: responseTime,
                severity: req.security?.severity,
                attackType: req.security?.attackType,
                actionTaken: req.security?.actionTaken,
                browser: browser.name,
                operatingSystem: os.name,
                device: device.type,
                requestId: req.requestId,
                riskScore: req.security?.riskScore ?? 0
            })

        } catch (error) {
            logger.error("Failed to save security log", error);
        }

        // Save to SecurityLog here
    });

    next();
};

export default requestLogger