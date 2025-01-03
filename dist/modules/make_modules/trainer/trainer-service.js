"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.trainerService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const queryBuilder_1 = __importDefault(require("../../../builder/queryBuilder"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const studio_model_1 = __importDefault(require("../studio/studio-model"));
const trainer_model_1 = require("./trainer-model");
const traner_constant_1 = require("./traner-constant");
const trainerReview_model_1 = require("../trainerReview/trainerReview.model");
const mongodb_1 = require("mongodb");
const createTrainerDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const studio = yield studio_model_1.default.findById(payload.studioId);
    if (!studio) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Studio Not found ');
    }
    const result = yield trainer_model_1.trainerModel.create(Object.assign(Object.assign({}, payload), { studioName: studio === null || studio === void 0 ? void 0 : studio.studioName, neighborhood: studio.neighborhood }));
    return result;
});
const getTrainerDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const trainer = yield trainer_model_1.trainerModel.findById(id);
    if (!trainer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "trainer not found");
    }
    const reviews = yield trainerReview_model_1.trainerReviewModal.find({ trainerId: id });
    const totalReviews = reviews.length;
    const totalDiffcultTrainer = parseFloat((reviews.reduce((sum, review) => sum + review.diffcultTrainer, 0) / totalReviews).toFixed(1));
    const totalTakeClass = totalReviews > 0
        ? ((reviews.filter(review => review.takeClass).length / totalReviews) * 100).toFixed(1)
        : 0.00;
    const tagAggregation = yield trainerReview_model_1.trainerReviewModal.aggregate([
        { $match: { trainerId: new mongodb_1.ObjectId(id) } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 },
        { $project: { _id: 0, tag: "$_id" } }
    ]);
    const topTags = tagAggregation.map((doc) => doc.tag);
    const ratingData = reviews.reduce((acc, review) => {
        acc.overallRating += review.trainerRate;
        acc[review.trainerRate] = (acc[review.trainerRate] || 0) + 1;
        return acc;
    }, { overallRating: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    const overallRating = parseFloat((ratingData.overallRating / totalReviews).toFixed(1));
    const response = {
        data: Object.assign(Object.assign({}, trainer.toObject()), { totalDiffcultTrainer,
            totalTakeClass,
            topTags, rating: { overallRating,
                1: ratingData[1],
                2: ratingData[2],
                3: ratingData[3],
                4: ratingData[4],
                5: ratingData[5],
            } }),
    };
    return response;
});
// const getTrainersDB = async (query: Record<string, unknown>) => {
//     const trainerQuery: any = new queryBuilder(trainerModel.find({ isApprove: true }), query)
//         .search(TrainerSearchbleField)
//         .paginate();
//     const trainers = await trainerQuery.modelQuery.exec(); 
//     const enrichedTrainers = await Promise.all(
//         trainers.map(async (trainer: any) => {
//             const trainerId = trainer._id;
//             const reviews = await trainerReviewModal.find({ trainerId });
//             const diffcultyTrainer = reviews.length? parseFloat( (reviews.reduce((sum, review) => sum + review.diffcultTrainer, 0) /reviews.length ).toFixed(1) ): 0;
//             const ratingData = reviews.reduce((acc: any, review) => {
//                     acc.overallRating += review.trainerRate;
//                     acc[review.trainerRate] = (acc[review.trainerRate] || 0) + 1;
//                     return acc;},
//                     { overallRating: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } );
//             const reviewCount = reviews.length;
//             const overallRating = reviewCount? parseFloat((ratingData.overallRating / reviewCount).toFixed(1)): 0
//             return {
//                 ...trainer.toObject(),
//                 reviewCount,
//                 overallRating,
//                 diffcultyTrainer,
//             };
//         })
//     );
//     const currentPage = typeof query.page === "number" ? query.page : 1;
//     const limit = typeof query.limit === "number" ? query.limit : 10;
//     const pagination = trainerQuery.calculatePagination({ totalData: trainers.length,currentPage, limit });
//     return {
//         pagination,
//         trainers: enrichedTrainers,
//     };
// };
const getTrainersDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const trainerQuery = new queryBuilder_1.default(trainer_model_1.trainerModel.find(), query).search(traner_constant_1.TrainerSearchbleField).filter();
    const { totalData } = yield trainerQuery.paginate(trainer_model_1.trainerModel);
    const trainers = yield trainerQuery.modelQuery.exec();
    const enrichedTrainers = yield Promise.all(trainers.map((trainer) => __awaiter(void 0, void 0, void 0, function* () {
        const trainerId = trainer._id;
        const reviews = yield trainerReview_model_1.trainerReviewModal.find({ trainerId });
        const diffcultyTrainer = reviews.length ? parseFloat((reviews.reduce((sum, review) => sum + review.diffcultTrainer, 0) / reviews.length).toFixed(1)) : 0;
        const ratingData = reviews.reduce((acc, review) => {
            acc.overallRating += review.trainerRate;
            acc[review.trainerRate] = (acc[review.trainerRate] || 0) + 1;
            return acc;
        }, { overallRating: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
        const reviewCount = reviews.length;
        const overallRating = reviewCount
            ? parseFloat((ratingData.overallRating / reviewCount).toFixed(1))
            : 0;
        return Object.assign(Object.assign({}, trainer.toObject()), { reviewCount,
            overallRating,
            diffcultyTrainer });
    })));
    const currentPage = typeof query.page === "number" ? query.page : 1;
    const limit = typeof query.limit === "number" ? query.limit : 10;
    const pagination = trainerQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });
    return {
        pagination,
        trainers: enrichedTrainers,
    };
});
const similartainerDB = (value) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trainer_model_1.trainerModel.find({ trainingType: value });
    return result;
});
exports.trainerService = {
    createTrainerDB,
    getTrainerDB,
    getTrainersDB,
    similartainerDB
};
