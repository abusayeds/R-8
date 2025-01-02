/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { studioReviewModel } from "../studioReview/studioReview.model";
import { TStudio } from "./studio-interfacer";
import studioModel from "./studio-model";
import { ObjectId } from 'mongodb';
import queryBuilder from "../../../builder/queryBuilder";
import { calculateReviewQuality, calculateReviewQuality2, defaultAverages, studioSearchbleField } from "./studio.constant";
const createStudioDB = async (payload: TStudio,) => {
    const result = await studioModel.create(payload)
    return result
}

//     const result = await studioModel.findById(id);

//     if (!result) {
//         throw new AppError(httpStatus.NOT_FOUND, "Studio not found");
//     }
//     const matchingReviews = await studioReviewModel.aggregate([
//         { $match: { studioId: new ObjectId(id) } }
//     ]);
//     if (matchingReviews.length === 0) {
//         return { result, averages: [] };
//     }
//     const studioAverages = await studioReviewModel.aggregate([
//         { $match: { studioId: new ObjectId(id) } },
//         {
//             $group: {
//                 _id: null,
//                 sumReputation: { $sum: "$reputation" },
//                 sumLocation: { $sum: "$location" },
//                 sumParking: { $sum: "$parking" },
//                 sumAtmosphere: { $sum: "$atmosphere" },
//                 sumAvailability: { $sum: "$availability" },
//                 sumCleanliness: { $sum: "$cleanliness" },
//                 sumEquipment: { $sum: "$equipment" },
//                 sumGracePeriod: { $sum: "$gracePeriod" },
//                 count: { $sum: 1 },
//                 socksTrueCount: { $sum: { $cond: [{ $eq: ["$socks", true] }, 1, 0] } },
//                 socksFalseCount: { $sum: { $cond: [{ $eq: ["$socks", false] }, 1, 0] } },
//                 validateParkingTrueCount: { $sum: { $cond: [{ $eq: ["$validateParking", true] }, 1, 0] } },
//                 validateParkingFalseCount: { $sum: { $cond: [{ $eq: ["$validateParking", false] }, 1, 0] } }
//             }
//         },
//         {
//             $project: {
//                 avgReputation: { $divide: ["$sumReputation", "$count"] },
//                 avgLocation: { $divide: ["$sumLocation", "$count"] },
//                 avgParking: { $divide: ["$sumParking", "$count"] },
//                 avgAtmosphere: { $divide: ["$sumAtmosphere", "$count"] },
//                 avgAvailability: { $divide: ["$sumAvailability", "$count"] },
//                 avgCleanliness: { $divide: ["$sumCleanliness", "$count"] },
//                 avgEquipment: { $divide: ["$sumEquipment", "$count"] },
//                 avgGracePeriod: { $divide: ["$sumGracePeriod", "$count"] },
//                 avgShock: { $cond: { if: { $gte: ["$socksTrueCount", "$socksFalseCount"] }, then: true, else: false } },
//                 avgValidateParking: { $cond: { if: { $gte: ["$validateParkingTrueCount", "$validateParkingFalseCount"] }, then: true, else: false } }
//             }
//         }
//     ]);
//     const priceResult = await studioReviewModel.aggregate([
//         { $match: { studioId: new ObjectId(id) } },
//         { $group: { _id: "$price", count: { $sum: 1 } } },
//         { $sort: { count: -1, _id: -1 } },
//         { $limit: 1 }
//     ]);
//     const mostFrequentPrice = priceResult.length > 0 ? priceResult[0]._id : null;
//     const averages = studioAverages.length > 0 ? studioAverages[0] : {};
//     const roundToDecimal = (value: number) => {
//         if (value !== undefined && value !== null) {
//             return Math.round(value * 10) / 10;
//         }
//         return value;
//     };
//     Object.keys(averages).forEach(key => {
//         if (typeof averages[key] === 'number') {
//             averages[key] = roundToDecimal(averages[key]);
//         }
//     })
//     const reviews = await studioReviewModel.find({ studioId: new ObjectId(id) });

//     const overallQuality = reviews.reduce((acc, review) => {
//         const reviewData = review.toObject();
//         const { quality } = calculateReviewQuality2(reviewData);
//         return acc + parseFloat(quality);
//     }, 0);
//     const reviewCount = reviews.length;
//     const averageQuality = reviewCount > 0 ? (overallQuality / reviewCount).toFixed(1) : 0.0

//     return { result, averages, mostFrequentPrice, averageQuality, totalReview: reviewCount };
// };
const getSingleStudioDB = async (id: string) => {
    const studioObjectId = new ObjectId(id);
    const [studio, [averages], [priceResult], reviews] = await Promise.all([
        studioModel.findById(id),
        studioReviewModel.aggregate([
            { $match: { studioId: studioObjectId } },
            {
                $group: {
                    _id: null,
                    sumReputation: { $sum: "$reputation" },
                    sumLocation: { $sum: "$location" },
                    sumParking: { $sum: "$parking" },
                    sumAtmosphere: { $sum: "$atmosphere" },
                    sumAvailability: { $sum: "$availability" },
                    sumCleanliness: { $sum: "$cleanliness" },
                    sumEquipment: { $sum: "$equipment" },
                    sumGracePeriod: { $sum: "$gracePeriod" },
                    count: { $sum: 1 },
                    socksTrueCount: { $sum: { $cond: ["$socks", 1, 0] } },
                    validateParkingTrueCount: { $sum: { $cond: ["$validateParking", 1, 0] } },
                }
            },
            {
                $project: {
                    avgReputation: { $ifNull: [{ $divide: ["$sumReputation", "$count"] }, 0] },
                    avgLocation: { $ifNull: [{ $divide: ["$sumLocation", "$count"] }, 0] },
                    avgParking: { $ifNull: [{ $divide: ["$sumParking", "$count"] }, 0] },
                    avgAtmosphere: { $ifNull: [{ $divide: ["$sumAtmosphere", "$count"] }, 0] },
                    avgAvailability: { $ifNull: [{ $divide: ["$sumAvailability", "$count"] }, 0] },
                    avgCleanliness: { $ifNull: [{ $divide: ["$sumCleanliness", "$count"] }, 0] },
                    avgEquipment: { $ifNull: [{ $divide: ["$sumEquipment", "$count"] }, 0] },
                    avgGracePeriod: { $ifNull: [{ $divide: ["$sumGracePeriod", "$count"] }, 0] },
                    avgShock: { $gte: ["$socksTrueCount", { $subtract: ["$count", "$socksTrueCount"] }] },
                    avgValidateParking: { $gte: ["$validateParkingTrueCount", { $subtract: ["$count", "$validateParkingTrueCount"] }] },
                }
            }
        ]),
        studioReviewModel.aggregate([
            { $match: { studioId: studioObjectId } },
            { $group: { _id: "$price", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: -1 } },
            { $limit: 1 }
        ]),
        studioReviewModel.find({ studioId: studioObjectId }).lean(),
    ]);

    if (!studio) {
        throw new AppError(httpStatus.NOT_FOUND, "Studio not found");
    }
    const mostFrequentPrice = priceResult?._id || null;
    const averagesFinal = averages
        ? Object.entries(defaultAverages).reduce((acc, [key, defaultValue]) => {
              const value = (averages as any)[key] ?? defaultValue;
              acc[key] = typeof value === 'number' ? Math.round(value * 10) / 10 : value;
              return acc;
          }, {} as Record<string, any>)
        : defaultAverages;
    const { averageQuality, totalReview } = reviews.reduce(
        (acc, review) => {
            const { quality } = calculateReviewQuality2(review);
            acc.averageQuality += parseFloat(quality);
            acc.totalReview += 1;
            return acc;
        },
        { averageQuality: 0, totalReview: 0 }
    );

    return {
        result: studio,
        averages: averagesFinal,
        mostFrequentPrice,
        averageQuality: totalReview ? parseFloat((averageQuality / totalReview).toFixed(1)) : 0.0,
        totalReview,
    };
};
const getStudioReviewsDB = async (id: string) => {
    const result = await studioReviewModel.find({ studioId: id });
    const updatedResult = result.map((review) => {
        const reviewData = review.toObject();
        return calculateReviewQuality(reviewData);
    });
    
    return updatedResult;
};
const getStudiosDB = async (query: Record<string, unknown>) => {
    const studioQuery = new queryBuilder(studioModel.find(), query).search(studioSearchbleField).fields()
    const { totalData } = await studioQuery.paginate(studioModel);
    const result = await studioQuery.modelQuery.exec();
    const studios = await Promise.all(
        result.map(async (studio) => {
            const studioId = studio._id;
            const reviews = await studioReviewModel.find({ studioId });
            const overallQuality = reviews.reduce((acc, review) => {
                const reviewData = review.toObject();
                const { quality } = calculateReviewQuality(reviewData);
                return acc + parseFloat(quality);
            }, 0);

            const reviewCount = reviews.length;
            return {
                ...studio.toObject(),
                overallQuality: reviewCount > 0 ? overallQuality.toFixed(1) : 0.0,
                reviewCount,
            };
        })
    );
    const currentPage = typeof query.page === "number" ? query.page : 1;
    const limit = typeof query.limit === "number" ? query.limit : 10;
    const pagination = studioQuery.calculatePagination({
        totalData: totalData,
        currentPage,
        limit,
    });
    return { pagination, studios };
};

export const studioService = {
    createStudioDB,
    getSingleStudioDB,
    getStudioReviewsDB,
    getStudiosDB

}