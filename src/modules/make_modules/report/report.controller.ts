/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { reportService } from "./report-service";
import httpStatus from "http-status";
const createReport = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params
    const { user }: any = req
    const result = await reportService.createReportDB(reviewId, user, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Report created successfully !",
        data: result,
    });

});
const getRevidwReport = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await reportService.getRevidwReportDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get ALL Report Successfully !",
        data: result,
    });

});

export
    const reportController = {
        createReport,
        getRevidwReport,
    }