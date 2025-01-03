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
exports.savedTrainerService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../../errors/AppError"));
const trainer_model_1 = require("../trainer-model");
const model_1 = require("./model");
// import queryBuilder from "../../../../builder/queryBuilder"
const trainerReview_model_1 = require("../../trainerReview/trainerReview.model");
const createSavedTrainerDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const trainer = yield trainer_model_1.trainerModel.findById(payload.trainerId);
    if (!trainer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Trainer Not found ');
    }
    const savcedTrainer = yield model_1.savedTrainerModel.find({ trainerId: payload.trainerId, userId: payload.userId });
    if (savcedTrainer.length > 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Alrade saved !');
    }
    const result = yield model_1.savedTrainerModel.create(payload);
    return result;
});
const getSavedTrainersDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // const trainerQuery: any = new queryBuilder(trainerModel.find(), query)
    // const { totalData } = await trainerQuery.paginate(trainerModel);
    // const trainers = await trainerQuery.modelQuery.exec();
    const trainers = yield model_1.savedTrainerModel.find({ userId: userId }).populate('trainerId');
    const enrichedTrainers = yield Promise.all(trainers.map((trainer) => __awaiter(void 0, void 0, void 0, function* () {
        const trainerId = trainer.trainerId;
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
});
exports.savedTrainerService = {
    createSavedTrainerDB,
    getSavedTrainersDB
};
