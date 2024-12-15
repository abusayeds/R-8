import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { adminService } from "./admin.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";

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

export const adminController = {
    adminStudioRequest,
    adminTrainerRequest,
    adminApproveRequest,
    adminDenyRequest
}