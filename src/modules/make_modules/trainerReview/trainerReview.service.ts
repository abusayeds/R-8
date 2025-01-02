/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { TTrainerReview } from "./trainerReview.interface";
import { trainerReviewModal, } from "./trainerReview.model";
const createTrainerReviewDB = async (payload: TTrainerReview, user: any) => {
    const result = await trainerReviewModal.create({
        ...payload,
        userId: user.id
    });
    return result;
};

const singleTrainerReviewDB = async (id: string) => {
    const result = await trainerReviewModal.find({
        trainerId: id
    })
    return result

}

export const trainerReviewService = {
    createTrainerReviewDB,
    singleTrainerReviewDB
};
