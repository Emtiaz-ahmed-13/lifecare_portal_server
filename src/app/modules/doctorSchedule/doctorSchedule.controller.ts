import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { pick } from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import { prisma } from "../../shared/prisma";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";

/* =========================
   🔹 Create doctor schedule
   ========================= */
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const user = req.user as { email: string; role: string };

    const result = await DoctorScheduleService.insertIntoDB(
        { email: user.email },
        req.body
    );

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully",
        data: result,
    });
});


/* =========================
   🔹 Get all doctor schedules
   ========================= */
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

    const result = await DoctorScheduleService.getAllFromDB(
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

    const result = await DoctorScheduleService.schedulesForDoctor(
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

/* =========================
   🔹 Delete doctor schedule
   ========================= */
const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
    const { doctorId, scheduleId } = req.params;

    const result = await DoctorScheduleService.deleteScheduleFromDB({
        doctorId: Number(doctorId),
        scheduleId,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule deleted successfully",
        data: result,
    });
});

const updateScheduleFromDB = async (
    payload: { doctorId: number; scheduleId: string },
    data: { isBooked?: boolean }
) => {
    return prisma.doctorSchedule.update({
        where: {
            scheduleId_doctorId: payload,
        },
        data,
    });
};
export const DoctorScheduleController = {
    insertIntoDB,
    getAllFromDB,
    schedulesForDoctor,
    deleteScheduleFromDB,

};

