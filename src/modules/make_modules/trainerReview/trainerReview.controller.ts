/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { trainerReviewService } from "./trainerReview.service";


const createTrainerReview = catchAsync(async (req: Request, res: Response) => {
     const {user} : any = req
    const result = await trainerReviewService.createTrainerReviewDB(req.body, user )
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Trainer review created successfully !",
        data: result,
    });

});
const singleTrainerReview = catchAsync(async (req: Request, res: Response) => {
    const { trainerId } = req.params
    const result = await trainerReviewService.singleTrainerReviewDB(trainerId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "  Trainer all review get successfully !",
        data: result,
    });

});

export const trainerRevieewController = {
    createTrainerReview,
    singleTrainerReview
}