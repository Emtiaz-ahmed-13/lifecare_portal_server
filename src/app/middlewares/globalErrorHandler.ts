import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err?.message || "Something went wrong!";
    let errorDetails: any = null;

    /* =========================
       🔹 Prisma Validation Error
       ========================= */
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Prisma validation error";
        errorDetails = err.message;
    }

    /* =========================
       🔹 Prisma Known Request Error
       ========================= */
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = httpStatus.BAD_REQUEST;

        switch (err.code) {
            case "P2002":
                message = "Duplicate key error";
                errorDetails = err.meta;
                break;

            case "P1000":
                message = "Database authentication failed";
                errorDetails = err.meta;
                break;

            case "P1003":
                message = "Foreign key constraint failed";
                errorDetails = err.meta;
                break;

            default:
                message = "Prisma client request error";
                errorDetails = err.meta;
        }
    }

    /* =========================
       🔹 Prisma Init Error
       ========================= */
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Prisma initialization error";
        errorDetails = err.message;
    }

    /* =========================
       🔹 Generic Error
       ========================= */
    else if (err instanceof Error) {
        statusCode = httpStatus.BAD_REQUEST;
        message = err.message;
        errorDetails = err.stack;
    }

    res.status(statusCode).json({
        success,
        message,
        error: errorDetails,
    });
};

export default globalErrorHandler;
