import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    const { accessToken, refreshToken, UserNeedPasswordChange } = result;

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 90,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User login successfully",
        data: {
            UserNeedPasswordChange,
        },
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Access token generated successfully",
        data: result,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await AuthService.changePassword(user, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully",
        data: result,
    });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password reset link sent to email",
        data: result,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.resetPassword(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password reset successfully",
        data: result,
    });
});

export const AuthController = {
    login,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
