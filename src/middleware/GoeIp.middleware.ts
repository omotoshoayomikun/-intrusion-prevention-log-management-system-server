import { NextFunction, Request, Response } from "express";
// import { getClientIp } from "../utils/get-client-ip";
// import { getGeoLocation } from "../utils/geo-ip";
import geoip from "geoip-lite";
import { getClientIp } from "../config/getClientIp";

const geoIpMiddleware = (req: Request, _: Response, next: NextFunction) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = getClientIp(req);
    // const geo = getGeoLocation(ip());

    const geo = () => {
        const geo = geoip.lookup(ip);

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

        // console.log(`Geo IP: ${geo().city}, ${geo().region}, ${geo().country}`);

    req.geo = geo();
    next();
};

export default geoIpMiddleware;