/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status"
import AppError from "../../../../errors/AppError"
import { trainerModel } from "../trainer-model"
import { savedTrainerModel, TSaveTrainer } from "./model"
// import queryBuilder from "../../../../builder/queryBuilder"
import { trainerReviewModal } from "../../trainerReview/trainerReview.model"

const createSavedTrainerDB = async (payload: TSaveTrainer,) => {
    const trainer = await trainerModel.findById(payload.trainerId)
    if (!trainer) {
        throw new AppError(httpStatus.NOT_FOUND, 'Trainer Not found ')
    }
    const savcedTrainer = await savedTrainerModel.find({ trainerId: payload.trainerId, userId: payload.userId })
    if (savcedTrainer.length > 0 ) {
        throw new AppError(httpStatus.NOT_FOUND, 'Alrade saved !')
    }
    const result = await savedTrainerModel.create(payload)
    return result
}

const getSavedTrainersDB = async (userId: string) => {
    // const trainerQuery: any = new queryBuilder(trainerModel.find(), query)
    // const { totalData } = await trainerQuery.paginate(trainerModel);
    // const trainers = await trainerQuery.modelQuery.exec();
    const trainers = await savedTrainerModel.find({ userId: userId }).populate('trainerId')
    const enrichedTrainers = await Promise.all(
        trainers.map(async (trainer: any) => {
            const trainerId = trainer.trainerId;
            const reviews = await trainerReviewModal.find({ trainerId });
            const diffcultyTrainer = reviews.length ? parseFloat((reviews.reduce((sum, review) => sum + review.diffcultTrainer, 0) / reviews.length).toFixed(1)) : 0;
            const ratingData = reviews.reduce(
                (acc: any, review) => {
                    acc.overallRating += review.trainerRate;
                    acc[review.trainerRate] = (acc[review.trainerRate] || 0) + 1;
                    return acc;
                },
                { overallRating: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            );
            const reviewCount = reviews.length;
            const overallRating = reviewCount
                ? parseFloat((ratingData.overallRating / reviewCount).toFixed(1))
                : 0;
            return {
                ...trainer.toObject(),
                reviewCount,
                overallRating,
                diffcultyTrainer,
            };
        })
    );
    // const currentPage = typeof query.page === "number" ? query.page : 1;
    // const limit = typeof query.limit === "number" ? query.limit : 10;
    // const pagination = trainerQuery.calculatePagination({
    //     totalData,
    //     currentPage,
    //     limit,
    // });

    return {
        trainers: enrichedTrainers,
    };
};


export const savedTrainerService = {
    createSavedTrainerDB,
    getSavedTrainersDB
}