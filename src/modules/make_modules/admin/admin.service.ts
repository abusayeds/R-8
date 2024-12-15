import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { adminStudioApproveModel, admintrainerApproveModel } from "./adminApproveModel";
import { trainerModel } from "../trainer/trainer-model";
import studioModel from "../studio/studio-model";

const adminStudioRequestDB  = async () => {
    const result = await adminStudioApproveModel.find();
    return result
};
const adminTrainerRequestDB  = async () => {
    const result = await admintrainerApproveModel.find();
    return result
};
const adminApproveRequestDB  = async (id : string) => {
    const findStudio = await adminStudioApproveModel.findOne({studioId : id})
    const findTrainer = await admintrainerApproveModel.findOne({trainerId : id})
    if(findStudio){
        await studioModel.findByIdAndUpdate(id, {isApprove : true } ,{ new: true })
        await adminStudioApproveModel.deleteOne({studioId : id})
    }  else if (findTrainer) {
         await trainerModel.findByIdAndUpdate(id, {isApprove : true } ,{ new: true })
         await admintrainerApproveModel.deleteOne({trainerId : id})
    } else{
        throw new AppError (httpStatus.BAD_REQUEST, 'Wrong request') 
    }
};
const adminDenyRequestDB  = async (id : string) => {
    const findStudio = await adminStudioApproveModel.findOne({studioId : id})
    const findTrainer = await admintrainerApproveModel.findOne({trainerId : id})
    if(findStudio){
        await studioModel.findByIdAndDelete(id)
        await adminStudioApproveModel.deleteOne({studioId : id})
    }  else if (findTrainer) {
         await trainerModel.findByIdAndDelete(id)
         await admintrainerApproveModel.deleteOne({trainerId : id})
    } else{
        throw new AppError (httpStatus.BAD_REQUEST, 'Wrong request') 
    }
};
 
export const adminService  = {
    adminStudioRequestDB,
    adminTrainerRequestDB,
    adminApproveRequestDB,
    adminDenyRequestDB
}

// const getStudioReviewsDB = async () => {
//     const result = await studioReviewModel.find({ studioId: id });
    
//     const updatedResult = result.map((review) => {
//         const reviewData = review.toObject();
//         return calculateReviewQuality(reviewData); 
//     });
    
//     return updatedResult;
// };