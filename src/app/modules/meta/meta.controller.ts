import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { MetaService } from "./meta.service";


const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await MetaService.getDashboardStats(user);
    sendResponse(res, { statusCode: 200, success: true, message: "Dashboard stats fetched successfully", data: result });
});

export const MetaController = { getDashboardStats };
