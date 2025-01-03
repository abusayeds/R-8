"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studioService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const studioReview_model_1 = require("../studioReview/studioReview.model");
const studio_model_1 = __importDefault(require("./studio-model"));
const mongodb_1 = require("mongodb");
const queryBuilder_1 = __importDefault(require("../../../builder/queryBuilder"));
const studio_constant_1 = require("./studio.constant");
const createStudioDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield studio_model_1.default.create(payload);
    return result;
});
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
const getSingleStudioDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const studioObjectId = new mongodb_1.ObjectId(id);
    const [studio, [averages], [priceResult], reviews] = yield Promise.all([
        studio_model_1.default.findById(id),
        studioReview_model_1.studioReviewModel.aggregate([
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
        studioReview_model_1.studioReviewModel.aggregate([
            { $match: { studioId: studioObjectId } },
            { $group: { _id: "$price", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: -1 } },
            { $limit: 1 }
        ]),
        studioReview_model_1.studioReviewModel.find({ studioId: studioObjectId }).lean(),
    ]);
    if (!studio) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Studio not found");
    }
    const mostFrequentPrice = (priceResult === null || priceResult === void 0 ? void 0 : priceResult._id) || null;
    const averagesFinal = averages
        ? Object.entries(studio_constant_1.defaultAverages).reduce((acc, [key, defaultValue]) => {
            var _a;
            const value = (_a = averages[key]) !== null && _a !== void 0 ? _a : defaultValue;
            acc[key] = typeof value === 'number' ? Math.round(value * 10) / 10 : value;
            return acc;
        }, {})
        : studio_constant_1.defaultAverages;
    const { averageQuality, totalReview } = reviews.reduce((acc, review) => {
        const { quality } = (0, studio_constant_1.calculateReviewQuality2)(review);
        acc.averageQuality += parseFloat(quality);
        acc.totalReview += 1;
        return acc;
    }, { averageQuality: 0, totalReview: 0 });
    return {
        result: studio,
        averages: averagesFinal,
        mostFrequentPrice,
        averageQuality: totalReview ? parseFloat((averageQuality / totalReview).toFixed(1)) : 0.0,
        totalReview,
    };
});
const getStudioReviewsDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield studioReview_model_1.studioReviewModel.find({ studioId: id });
    const updatedResult = result.map((review) => {
        const reviewData = review.toObject();
        return (0, studio_constant_1.calculateReviewQuality)(reviewData);
    });
    return updatedResult;
});
const getStudiosDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const studioQuery = new queryBuilder_1.default(studio_model_1.default.find(), query).search(studio_constant_1.studioSearchbleField).fields();
    const { totalData } = yield studioQuery.paginate(studio_model_1.default);
    const result = yield studioQuery.modelQuery.exec();
    const studios = yield Promise.all(result.map((studio) => __awaiter(void 0, void 0, void 0, function* () {
        const studioId = studio._id;
        const reviews = yield studioReview_model_1.studioReviewModel.find({ studioId });
        const overallQuality = reviews.reduce((acc, review) => {
            const reviewData = review.toObject();
            const { quality } = (0, studio_constant_1.calculateReviewQuality)(reviewData);
            return acc + parseFloat(quality);
        }, 0);
        const reviewCount = reviews.length;
        return Object.assign(Object.assign({}, studio.toObject()), { overallQuality: reviewCount > 0 ? overallQuality.toFixed(1) : 0.0, reviewCount });
    })));
    const currentPage = typeof query.page === "number" ? query.page : 1;
    const limit = typeof query.limit === "number" ? query.limit : 10;
    const pagination = studioQuery.calculatePagination({
        totalData: totalData,
        currentPage,
        limit,
    });
    return { pagination, studios };
});
exports.studioService = {
    createStudioDB,
    getSingleStudioDB,
    getStudioReviewsDB,
    getStudiosDB
};
