import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PatientHealthDataService } from "./patientHealthData.service";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await PatientHealthDataService.createOrUpdateHealthData(user, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: "Health Data updated successfully", data: result });
});

const getFromDb = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await PatientHealthDataService.getHealthData(user);
    sendResponse(res, { statusCode: 200, success: true, message: "Health Data fetched successfully", data: result });
});

export const PatientHealthDataController = { insertIntoDb, getFromDb };
