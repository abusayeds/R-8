import { TStudioReview } from "./studioReview.interface";
import { studioReviewModel } from "./studioReview.model";



const createStudioDB = async (payload: TStudioReview) => {
    const result = await studioReviewModel.create(payload);
    return result;
};



export const studioReviewServise = {
    createStudioDB, 
   
}