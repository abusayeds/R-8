import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { adminStudioApproveModel, admintrainerApproveModel, userVisitModel } from "./adminModel";
import { trainerModel } from "../trainer/trainer-model";
import studioModel from "../studio/studio-model";
import { UserModel } from "../../basic_modules/user/user.model";
import { studioReviewModel } from "../studioReview/studioReview.model";
import { trainerReviewModal } from "../trainerReview/trainerReview.model";

const adminDB = async () => {
    const [user, trainer, studio, visitor] = await Promise.all([
        UserModel.find(),
        trainerModel.find(),
        studioModel.find(),
        userVisitModel.findOne()
    ]);
    const info = {
        totalUser: user.length,
        totalTrainer: trainer.length,
        totalStudio: studio.length,
        totalVisitor: visitor ? visitor.count : 0,
    };

    return info;
}

const adminStudioRequestDB = async () => {
    const result = await adminStudioApproveModel.find({
        action: false
    }).populate('studioId');
    return result
};
const adminTrainerRequestDB = async () => {
    const result = await admintrainerApproveModel.find({
        action: false
    }).populate({
        path: 'trainerId',
        select: 'firstName lastName studioName trainingType'
    });
    return result
};
const adminApproveRequestDB = async (id: string) => {
    const findStudio = await adminStudioApproveModel.findOne({ studioId: id })
    const findTrainer = await admintrainerApproveModel.findOne({ trainerId: id })
    if (findStudio) {
        await studioModel.findByIdAndUpdate(id, { isApprove: true }, { new: true })
        await adminStudioApproveModel.deleteOne({ studioId: id })
    } else if (findTrainer) {
        await trainerModel.findByIdAndUpdate(id, { isApprove: true }, { new: true })
        await admintrainerApproveModel.deleteOne({ trainerId: id })
    } else {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wrong request')
    }
};
const adminDenyRequestDB = async (id: string) => {
    const findStudio = await adminStudioApproveModel.findOne({ studioId: id })
    const findTrainer = await admintrainerApproveModel.findOne({ trainerId: id })
    if (findStudio) {
        await studioModel.findByIdAndDelete(id)
        await adminStudioApproveModel.deleteOne({ studioId: id })
    } else if (findTrainer) {
        await trainerModel.findByIdAndDelete(id)
        await admintrainerApproveModel.deleteOne({ trainerId: id })
    } else {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wrong request')
    }
};
const deleteReviewsDB = async (id: string) => {
    const studioReview = await studioReviewModel.findById(id);
    const trainerReview = await trainerReviewModal.findById(id);
    if (studioReview) {
        await studioReviewModel.findByIdAndDelete(id)
    }
    if (trainerReview) {
        await trainerReviewModal.findByIdAndDelete(id)
    }
};
const blockUserDB = async (id: string) => {
    const result = await UserModel.findByIdAndUpdate(id, { isblock: true }, { new: true })
    return result
};

export const adminService = {
    adminStudioRequestDB,
    adminTrainerRequestDB,
    adminApproveRequestDB,
    adminDenyRequestDB,
    adminDB,
    deleteReviewsDB,
    blockUserDB
}

