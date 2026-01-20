import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { jwtHelper } from "../helper/jwtHelper";

// custom decoded payload type
interface AuthPayload extends JwtPayload {
    email: string;
    role: string;
}

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.accessToken;

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const decoded = jwtHelper.verifyToken(
                token,
                process.env.ACCESS_TOKEN_SECRET as string
            ) as AuthPayload;

            // role check
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                });
            }

            // attach user
            req.user = decoded;

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
    };
};

export default auth;
