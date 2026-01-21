import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";

const bookAppointment = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await AppointmentService.bookAppointment(req.body, user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment booked successfully!",
        data: result
    });
});

const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await AppointmentService.getMyAppointments(user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointments fetched successfully!",
        data: result
    });
});

export const AppointmentController = {
    bookAppointment,
    getMyAppointments
};
