/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status"
import queryBuilder from "../../../builder/queryBuilder"
import AppError from "../../../errors/AppError"
import studioModel from "../studio/studio-model"
import { TTrainer } from "./trainer-interfacer"
import { trainerModel } from "./trainer-model"
import { TrainerSearchbleField } from "./traner-constant"
import paginationBuilder from "../../../utils/paginationBuilder"
import { trainerReviewModal } from "../trainerReview/trainerReview.model"
import { ObjectId } from 'mongodb';

const createTrainerDB = async (payload: TTrainer,) => {
    const studio = await studioModel.findById(payload.studioId)
    if (!studio) {
        throw new AppError(httpStatus.NOT_FOUND, 'Studio Not found ')
    }
    const result = await trainerModel.create({
        ...payload,
        studioName: studio?.studioName
    })
    return result
}

const getTrainerDB = async (id: string) => {
    const trainer = await trainerModel.findById(id);
    if (!trainer) {
        throw new AppError(httpStatus.NOT_FOUND, "trainer not found")
    }
    const reviews = await trainerReviewModal.find({ trainerId: id });
    const totalReviews = reviews.length;
    const totalDiffcultTrainer = parseFloat(
        (reviews.reduce((sum, review) => sum + review.diffcultTrainer, 0) / totalReviews).toFixed(1)
    );
    const totalTakeClass = reviews.filter((review) => review.takeClass).length;
    const tagAggregation = await trainerReviewModal.aggregate([
        { $match: { trainerId: new ObjectId(id) } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 },
        { $project: { _id: 0, tag: "$_id" } }
    ]);
    const topTags = tagAggregation.map((doc) => doc.tag);
    const ratingData = reviews.reduce(
        (acc: any, review) => {
            acc.overallRating += review.trainerRate;
            acc[review.trainerRate] = (acc[review.trainerRate] || 0) + 1;
            return acc;
        },
        { overallRating: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    );
    const overallRating = parseFloat((ratingData.overallRating / totalReviews).toFixed(1));
    const response = {
        data: {
            ...trainer.toObject(),
            totalDiffcultTrainer,
            totalTakeClass,
            topTags,
            rating: {
                overallRating,
                1: ratingData[1],
                2: ratingData[2],
                3: ratingData[3],
                4: ratingData[4],
                5: ratingData[5],
            },
        },
    };

    return response;

};
const getTrainersDB = async (query: Record<string, unknown>) => {
    const count = await trainerModel.countDocuments({});
    const trainerQuery = new queryBuilder(trainerModel.find({ isApprove: true }), query)
        .search(TrainerSearchbleField)
        .pagenate();

    const trainers = await trainerQuery.modelQuery;

    const enrichedTrainers = await Promise.all(
        trainers.map(async (trainer) => {
            const trainerId = trainer._id;
            const reviews = await trainerReviewModal.find({ trainerId });
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
            };
        })
    );
    const currentPage = typeof query.page === "number" ? query.page : 1;
    const limit = typeof query.limit === "number" ? query.limit : 10;
    const pagination = paginationBuilder({
        totalData: count,
        currentPage,
        limit,
    });
    return {
        pagination,
        trainers: enrichedTrainers,
    };
};


export const trainerService = {
    createTrainerDB,
    getTrainerDB,
    getTrainersDB
}