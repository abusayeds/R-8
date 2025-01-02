/* eslint-disable @typescript-eslint/no-explicit-any */
import { TStudioReview } from "./studioReview.interface";
import { studioReviewModel } from "./studioReview.model";
const createStudioReviewDB = async (payload: TStudioReview, user : any ) => {
    const result = await studioReviewModel.create({
        ...payload,
        userId: user.id
    });
    return result;
};

const singleStudioReviewDB = async (id: string) => {
    const result = await studioReviewModel.find({
        studioId: id
    })
    return result

}

export const studioReviewServise = {
    singleStudioReviewDB,
    createStudioReviewDB

}