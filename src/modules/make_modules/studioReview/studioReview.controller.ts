import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { studioReviewServise } from "./studioReview.service";

const createStudio = catchAsync(async (req, res) => {
    const result = await studioReviewServise.createStudioDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Review created successfully ",
        data: result,
    });
});

 export const studioReviewController = {
    createStudio
}