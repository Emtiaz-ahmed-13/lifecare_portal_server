import { Request, Response } from "express";
import { pick } from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorFilterableFields } from "./doctor.constant";
import { DoctorService } from "./doctor.service";


const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await DoctorService.getAllFromDb(filters, {
        limit: Number(options.limit ?? 10),
        page: Number(options.page ?? 1),
        sortBy: options.sortBy as string | undefined,
        sortOrder: options.sortOrder as "asc" | "desc" | undefined
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctors fetched successfully",
        meta: result.meta,
        data: result.data
    });
});

const getByIdFromDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.getByIdFromDb(Number(id));
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor fetched successfully",
        data: result
    });
});

const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.updateIntoDb(Number(id), req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor updated successfully",
        data: result
    });
});

const deleteDoctorSpecialty = catchAsync(async (req: Request, res: Response) => {
    const { id, specialtyId } = req.params;
    const result = await DoctorService.deleteDoctorSpecialty(Number(id), specialtyId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor specialty deleted successfully",
        data: result
    });
});

const addDoctorSpecialty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.addDoctorSpecialty(Number(id), req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor specialty added successfully",
        data: result
    });
});

const suggestDoctors = catchAsync(async (req: Request, res: Response) => {
    const { symptoms } = req.body;
    const result = await DoctorService.suggestDoctors(symptoms);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctors suggested successfully based on AI analysis",
        data: result
    });
});

export const DoctorController = {
    getAllFromDb,
    getByIdFromDb,
    updateIntoDb,
    deleteDoctorSpecialty,
    addDoctorSpecialty,
    suggestDoctors
};
