import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { trainerService } from "./trainer-service";
import { admintrainerApproveModel } from "../admin/adminModel";

const createTrainer = catchAsync(async (req: Request, res: Response) => {
    const result = await trainerService.createTrainerDB(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Trainer created successfully !",
        data: result,
    });
    if (result.isApprove === false) {
        await admintrainerApproveModel.create(
            {
                trainerId: result._id
            }
        )
    }

});
const getTrainer = catchAsync(async (req: Request, res: Response) => {
    const { trainerId } = req.params
    const result = await trainerService.getTrainerDB(trainerId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Trainer received successfully !",
        data: result,
    });
});


const getTrainers = catchAsync(async (req: Request, res: Response) => {
    const result = await trainerService.getTrainersDB(req.query)
   
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Get All Trainer  successfully !",
        data: result,
    });

});
export const trainerController = {
    createTrainer,
    getTrainer,
    getTrainers
}