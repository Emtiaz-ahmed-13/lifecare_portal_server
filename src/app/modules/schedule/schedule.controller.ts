import { Request, Response } from "express";
import { pick } from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully",
        data: result,
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, [
        "page",
        "limit",
        "sortBy",
        "sortOrder",
    ]);

    const filters = pick(req.query, [
        "startDate",
        "endDate",
    ]);

    const result = await ScheduleService.getAllFromDB(
        {
            page: Number(options.page ?? 1),
            limit: Number(options.limit ?? 10),
            sortBy: options.sortBy as string | undefined,
            sortOrder: options.sortOrder as "asc" | "desc" | undefined,
        },
        {
            startDate: filters.startDate as string | undefined,
            endDate: filters.endDate as string | undefined,
        }
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule fetched successfully",
        data: result,
    });
});


/* =========================
   🔹 Doctor-wise schedules
   ========================= */
const schedulesForDoctor = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, [
        "page",
        "limit",
        "sortBy",
        "sortOrder",
    ]);

    const filters = pick(req.query, [
        "doctorId",
        "startDate",
        "endDate",
        "isBooked",
    ]);

    const result = await ScheduleService.schedulesForDoctor(
        {
            doctorId: Number(filters.doctorId),
            startDate: filters.startDate as string | undefined,
            endDate: filters.endDate as string | undefined,
            isBooked:
                filters.isBooked !== undefined
                    ? filters.isBooked === "true"
                    : undefined,
        },
        {
            page: Number(options.page ?? 1),
            limit: Number(options.limit ?? 10),
            sortBy: options.sortBy as string | undefined,
            sortOrder: options.sortOrder as "asc" | "desc" | undefined,
        }
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor schedules fetched successfully",
        data: result,
    });
});

const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ScheduleService.deleteSchedule(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule deleted successfully",
        data: result,
    });
});


export const ScheduleController = {
    insertIntoDB,
    getAllFromDB,
    schedulesForDoctor,
    deleteScheduleFromDB
};
