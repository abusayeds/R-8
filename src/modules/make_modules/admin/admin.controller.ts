import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { adminService } from "./admin.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";

const admin = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.adminDB()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Get All User, Studio , Trainer, Traffic successfully !",
        data: result,
    });
});
const adminStudioRequest = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.adminStudioRequestDB()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Get All Studio request  successfully !",
        data: result,
    });
});
const adminTrainerRequest = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.adminTrainerRequestDB()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Get All Trainer request  successfully !",
        data: result,
    });
});
const adminApproveRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    await adminService.adminApproveRequestDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Approve successfully !",
        data: null
    });
});
const adminDenyRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    await adminService.adminDenyRequestDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Request  Deny ",
        data: null
    });
});
const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params
    await adminService.deleteReviewsDB(reviewId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Review Dedeleted",
        data: null
    });
});
const blockUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params
    await adminService.blockUserDB(userId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Blocked",
        data: null
    });
});

export const adminController = {
    adminStudioRequest,
    adminTrainerRequest,
    adminApproveRequest,
    adminDenyRequest, 
    admin,
    deleteReview,
    blockUser
}