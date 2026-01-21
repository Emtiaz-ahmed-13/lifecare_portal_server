import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const { appointmentId } = req.body;
    const result = await PaymentService.initPayment(appointmentId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment initiated successfully",
        data: result
    });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
    const { sessionId, appointmentId } = req.query;
    const result = await PaymentService.validatePayment({ sessionId, appointmentId });

    // In a real app, you might redirect to a frontend success page here
    // res.redirect('http://localhost:5173/payment/success');

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment validated successfully",
        data: result
    });
});

const webhook = async (req: Request, res: Response) => {
    const result = await PaymentService.webhook(req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Webhook processed successfully",
        data: result
    });
};

export const PaymentController = {
    initPayment,
    validatePayment,
    webhook
};
