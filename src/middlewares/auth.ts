import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({
                success: false,
                error: "Authorization header missing"
            });
        }

        const parts = header.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer' || parts[1] == undefined) {
            return res.status(401).json({
                success: false,
                error: 'Token missing after Bearer'
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(token, jwtSecret as string) as JwtPayload;

        req.user = {
            userId: decoded.userId,
            username: decoded.username
        }

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            error: "Token invalid"
        });
    }
}