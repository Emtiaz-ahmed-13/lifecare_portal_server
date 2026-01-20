import { Request, Response } from "express";

import { pick } from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";


const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req.body, req.file)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Patient created successfully",
        data: result
    })
})

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createAdmin(req.body, req.file)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin created successfully",
        data: result
    })
})

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createDoctor(req.body, req.file)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor created successfully",
        data: result
    })
})

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
    // pagination + sorting
    const options = pick(req.query, [
        "page",
        "limit",
        "sortBy",
        "sortOrder",
    ]);

    // filtering + searching
    const filters = pick(req.query, [
        "searchTerm",
        "role",
        "status",
        "email",
    ]);

    const result = await UserService.getAllFromDb(
        {
            page: Number(options.page ?? 1),
            limit: Number(options.limit ?? 10),
            sortBy: options.sortBy as string | undefined,
            sortOrder: options.sortOrder as "asc" | "desc" | undefined,
        },
        {
            searchTerm: filters.searchTerm as string | undefined,
            role: filters.role as string | undefined,
            status: filters.status as string | undefined,
            email: filters.email as string | undefined,
        }
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All user fetched successfully",
        data: result,
    });
});

export const UserController = {
    createPatient,
    createAdmin,
    createDoctor,
    getAllFromDb
}