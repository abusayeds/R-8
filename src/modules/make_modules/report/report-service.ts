
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status"
import AppError from "../../../errors/AppError"
import { studioReviewModel } from "../studioReview/studioReview.model"
import { trainerReviewModal } from "../trainerReview/trainerReview.model"
import reportModel from "./report.model"
import { UserModel } from "../../basic_modules/user/user.model"
import { TReport } from "./report.interface"


const createReportDB = async (id: string, user: any, payload: TReport) => {
    const ifStudioReview = await studioReviewModel.findById(id)
    const ifTrainerReview = await trainerReviewModal.findById(id)
    if (ifStudioReview) {
        await UserModel.findByIdAndUpdate(ifStudioReview?.userId,
            { $inc: { report: 1 } })
        const result = await reportModel.create({
            ...payload,
            reportUser: user.id,
            reviewId: id,
            userId: ifStudioReview?.userId
        })
        return result
    } else if (ifTrainerReview) {
        await UserModel.findByIdAndUpdate(ifTrainerReview?.userId,
            { $inc: { report: 1 } })
        const result = await reportModel.create({
            ...payload,
            reviewId: id,
            userId: ifTrainerReview?.userId
        })
        return result
    } else {
        throw new AppError(httpStatus.NOT_FOUND, "This review not found !")
    }
}
const getRevidwReportDB = async (id: string) => {
    const result = await reportModel.find({ reviewId: id }).populate({
        path: "reportUser",
        select: "name email", 
    });
    return result;
};
export const reportService = {
    createReportDB,
    getRevidwReportDB
}