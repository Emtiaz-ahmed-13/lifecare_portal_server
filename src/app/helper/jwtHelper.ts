import jwt, { Secret, SignOptions } from "jsonwebtoken";
import ms from "ms";

const generateToken = (
    payload: Record<string, unknown>,
    secret: Secret,
    expiresIn: ms.StringValue | number
): string => {
    if (!secret) {
        throw new Error("JWT secret is missing");
    }

    const options: SignOptions = {
        expiresIn,
    };

    return jwt.sign(payload, secret, options);
};

export const jwtHelper = {
    generateToken,
};
