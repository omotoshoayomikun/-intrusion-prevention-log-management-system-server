import blockedIpMiddleware from "./BlockedIp.middleware";
import geoIpMiddleware from '../middleware/GoeIp.middleware';
import vpnDetectionMiddleware from '../middleware/CheckVpn.middleware';
import sqlInjectionMiddleware from '../middleware/SqlInjection.middleware';
import noSqlInjectionMiddleware from '../middleware/NoSqlInjection.middleware';
import xssMiddleware from '../middleware/Xss.middleware';
import riskScoreMiddleware from '../middleware/RiskScore.middleware';

export const securityMiddleware = [
    geoIpMiddleware,
    vpnDetectionMiddleware,
    blockedIpMiddleware,
    sqlInjectionMiddleware,
    noSqlInjectionMiddleware,
    xssMiddleware,
    riskScoreMiddleware,
]