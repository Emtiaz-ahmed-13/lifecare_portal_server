import { UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import { jwtHelper } from "../../helper/jwtHelper";
import { prisma } from "../../shared/prisma";
type LoginPayload = {
    email: string;
    password: string;
};

const login = async (payload: LoginPayload) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
    });

    if (user.status !== UserStatus.ACTIVE) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User is not active");
    }

    const isPasswordMatched = await bcrypt.compare(
        payload.password,
        user.password
    );

    if (!isPasswordMatched) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid password");
    }

    const accessToken = jwtHelper.generateToken(
        { email: user.email, role: user.role },
        config.jwt.access_secret,
        "1h"
    );

    const refreshToken = jwtHelper.generateToken(
        { email: user.email, role: user.role },
        config.jwt.refresh_secret,
        "90d"
    );

    return {
        accessToken,
        refreshToken,
        UserNeedPasswordChange: user.needPasswordChange,
    };
};

export const AuthService = {
    login,
};
