import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { MedicalReportService } from "./medicalReport.service";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await MedicalReportService.createReport(user, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: "Medical Report added successfully", data: result });
});

const getFromDb = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await MedicalReportService.getReports(user);
    sendResponse(res, { statusCode: 200, success: true, message: "Medical Reports fetched successfully", data: result });
});

export const MedicalReportController = { insertIntoDb, getFromDb };
