import { NextFunction, Request, Response } from "express";
// import { getClientIp } from "../utils/get-client-ip";
// import { getGeoLocation } from "../utils/geo-ip";
import geoip from "geoip-lite";

const geoIpMiddleware = (req: Request, _: Response, next: NextFunction) => {
    // const ip = getClientIp(req);
    const forwarded = req.headers["x-forwarded-for"];
    console.log(`Forwarded IP: ${forwarded}`);
    console.log(geoip.lookup("1.1.1.1"));
    const ip = () => {
        if (typeof forwarded === "string") {
            return forwarded.split(",")[0].trim();
        }
        if (Array.isArray(forwarded)) {
            return forwarded[0];
        }
        return (
            req.socket.remoteAddress ||
            req.ip ||
            ""
        );
    }

    console.log(`IP: ${ip()}`);

    // const geo = getGeoLocation(ip());

    const geo = () => {
        const geo = geoip.lookup(ip());

        if (!geo) {
            return {};
        }

        return {
            country: geo.country,
            region: geo.region,
            city: geo.city,
            latitude: geo.ll?.[0],
            longitude: geo.ll?.[1],
        };
    }

        console.log(`Geo IP: ${geo().city}, ${geo().region}, ${geo().country}`);

    req.geo = geo();
    next();
};

export default geoIpMiddleware;