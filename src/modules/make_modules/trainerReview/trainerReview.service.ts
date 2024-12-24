
import { TTrainerReview } from "./trainerReview.interface";
import { trainerReviewModal, } from "./trainerReview.model";

const createTrainerReviewDB = async (payload: TTrainerReview) => {
    const result = await trainerReviewModal.create(payload);
    // const trainer = await trainerReviewModal.find({ trainerId: payload.trainerId })
    // const trainerRate = payload.trainerRate;
    // if (payload?.diffcultTrainer) {
    //     const totalDifficulty = trainer.reduce((sum, review) => sum + review.diffcultTrainer, 0);
    //     const averageDifficulty = parseFloat((totalDifficulty / trainer.length).toFixed(1))
    //     await trainerModel.findByIdAndUpdate(payload.trainerId, { diffcultTrainer: averageDifficulty }, { new: true });
    // }
    // if (trainerRate >= 1 && trainerRate <= 5) {
    //     const ratingKey = trainerRate.toString() as "1" | "2" | "3" | "4" | "5";
    //     await trainerModel.findByIdAndUpdate(payload.trainerId, {
    //         $inc: { [`rating.${ratingKey}`]: 1 }
    //     });
    // }
    // if (payload.takeClass) {
    //     const trainerTakeClassTrue = trainer.filter(item => item.takeClass === true);
    //     const takeClassAvarage = ((trainerTakeClassTrue.length / trainer.length) * 100).toFixed(1);
    //     await trainerModel.findByIdAndUpdate(payload.trainerId, { takeClass: takeClassAvarage }, { new: true });         
    // }
    // if (payload.tags.length >= 1 && payload.tags.length <= 3) {
    //     try {
    //         const result = await trainerReviewModal.aggregate([
    //             { $unwind: "$tags" },
    //             { $group: { _id: "$tags" } },
    //             { $sort: { _id: 1 } },
    //             { $limit: 3 },
    //             { $project: { _id: 0, tag: "$_id" } }
    //         ]);
    //         const topTags = result.map(doc => doc.tag);
    //        await trainerModel.findByIdAndUpdate(
    //             payload.trainerId,
    //             { topTags: topTags },
    //             { new: true }
    //         );
    //     } catch (error) {
    //         console.error("Error updating trainer:", error);
    //     }
    // }


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
