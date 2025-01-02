/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { studioReviewServise } from "./studioReview.service";

const createStudioReview = catchAsync(async (req, res) => {
    const {user} : any = req
    const result = await studioReviewServise.createStudioReviewDB(req.body , user );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Review created successfully ",
        data: result,
    });
});

const singleStudioReview = catchAsync(async (req ,res ) => {
    const { studioId } = req.params
    const result = await studioReviewServise.singleStudioReviewDB(studioId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "  Trainer all review get successfully !",
        data: result,
    });

});

 export const studioReviewController = {
    createStudioReview,
    singleStudioReview
}