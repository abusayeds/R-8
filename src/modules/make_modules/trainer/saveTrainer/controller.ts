import { Request, Response } from "express";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import httpStatus from "http-status";
import { savedTrainerService } from "./servise";

const createSaveTrainer = catchAsync(async (req: Request, res: Response) => {
    const result = await savedTrainerService.createSavedTrainerDB(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Trainer saved successfully !",
        data: result,
    });
    

});
const getSavedTrainer = catchAsync(async (req: Request, res: Response) => {
    const {userId} = req.params
    const result = await savedTrainerService.getSavedTrainersDB(userId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Saved Trainer received successfully !",
        data: result,
    });
});
 export const savedTranercontroller = {
    getSavedTrainer,
    createSaveTrainer

}