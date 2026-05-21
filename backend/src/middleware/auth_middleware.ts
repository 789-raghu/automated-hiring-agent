import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../@types/auth_request";
import logger from "../config/logger";

function authMiddleWare(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.cookies?.auth_token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }
        const decodedToken = jwt.verify(token, secret) as JwtPayload;
        req.user = decodedToken;
        next();
    } catch (error) {
        logger.error(error);
        return res.status(401).json({ error: "Unauthorized" });
    }
}

export default authMiddleWare;