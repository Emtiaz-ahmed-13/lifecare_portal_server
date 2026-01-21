import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./review.service";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await ReviewService.createReview(user, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: "Review created successfully", data: result });
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.getReviews(req.query);
    sendResponse(res, { statusCode: 200, success: true, message: "Reviews fetched successfully", data: result });
});

export const ReviewController = { insertIntoDb, getAllFromDb };
