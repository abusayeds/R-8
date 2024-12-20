import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { trainerReviewService } from "./trainerReview.service";


const createTrainerReview = catchAsync(async (req: Request, res: Response) => {
    const result = await trainerReviewService.createTrainerReviewDB(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Trainer review created successfully !",
        data: result,
    });

});

export const trainerRevieewController = {
    createTrainerReview
}