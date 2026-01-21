import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PrescriptionService } from "./prescription.service";

const createPrescription = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await PrescriptionService.createPrescription(user, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Prescription created successfully",
        data: result
    });
});

const getMyPrescriptions = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await PrescriptionService.getMyPrescriptions(user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Prescriptions fetched successfully",
        data: result
    });
});

export const PrescriptionController = {
    createPrescription,
    getMyPrescriptions
};
