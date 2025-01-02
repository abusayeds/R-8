import { Request, Response } from "express";

import httpStatus from "http-status";
import { studioService } from "./studio-service";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { adminStudioApproveModel } from "../admin/adminModel";

const createStudio = catchAsync(async (req: Request, res: Response) => {
    const result = await studioService.createStudioDB(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Studio created successfully !",
        data: result,
    });
    if (result.isApprove === false) {
        await adminStudioApproveModel.create(
            {
                studioId: result._id
            }
        )
    }

});
const getSingleStudio = catchAsync(async (req: Request, res: Response) => {
    const { studioId } = req.params
    const result = await studioService.getSingleStudioDB(studioId as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Get Studio  successfully !",
        data: result,
    });
});
const getStudioReviews = catchAsync(async (req: Request, res: Response) => {
    const { studioId } = req.params
    const result = await studioService.getStudioReviewsDB(studioId as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Get Studio reviews  successfully !",
        data: result,
    });


});
const getStudios = catchAsync(async (req: Request, res: Response) => {
    const result = await studioService.getStudiosDB(req.query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Get Studio  successfully !",
        data: result,
    });

});

export const studioController = {
    createStudio,
    getSingleStudio,
    getStudioReviews,
    getStudios
}