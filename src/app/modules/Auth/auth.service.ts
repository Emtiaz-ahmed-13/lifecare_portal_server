import { UserNeedPasswordChange, UserStatus } from "@prisma/client";
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
        config.jwt.access_expires_in as any
    );

    const refreshToken = jwtHelper.generateToken(
        { email: user.email, role: user.role },
        config.jwt.refresh_secret,
        config.jwt.refresh_expires_in as any
    );

    return {
        accessToken,
        refreshToken,
        UserNeedPasswordChange: user.needPasswordChange,
    };
};

const refreshToken = async (token: string) => {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelper.verifyToken(token, config.jwt.refresh_secret);
    } catch (err) {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
    }

    const { email } = verifiedToken;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email,
            status: UserStatus.ACTIVE,
        },
    });

    const accessToken = jwtHelper.generateToken(
        { email: user.email, role: user.role },
        config.jwt.access_secret,
        config.jwt.access_expires_in as any
    );

    return {
        accessToken,
    };
};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE,
        },
    });

    const isPasswordMatched = await bcrypt.compare(
        payload.oldPassword,
        userData.password
    );

    if (!isPasswordMatched) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Old password does not match");
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: user.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: UserNeedPasswordChange.FALSE,
        },
    });

    return {
        message: "Password changed successfully",
    };
};

const forgotPassword = async (payload: any) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE,
        },
    });

    const resetToken = jwtHelper.generateToken(
        { email: user.email, role: user.role },
        config.jwt.reset_password_secret as string,
        config.jwt.reset_password_expires_in as any
    );

    // In a real app, send this via email. For now, just return it.
    console.log("Reset Token:", resetToken);

    return {
        message: "Password reset link sent to email",
        resetToken, // Returning for testing purposes
    };
};

const resetPassword = async (payload: any) => {
    const { token, newPassword } = payload;

    const verifiedToken = jwtHelper.verifyToken(
        token,
        config.jwt.reset_password_secret as string
    );

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: {
            email: verifiedToken.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: UserNeedPasswordChange.FALSE,
        },
    });

    return {
        message: "Password reset successfully",
    };
};

export const AuthService = {
    login,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
