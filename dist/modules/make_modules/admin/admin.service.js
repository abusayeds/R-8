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
exports.adminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const adminModel_1 = require("./adminModel");
const trainer_model_1 = require("../trainer/trainer-model");
const studio_model_1 = __importDefault(require("../studio/studio-model"));
const user_model_1 = require("../../basic_modules/user/user.model");
const studioReview_model_1 = require("../studioReview/studioReview.model");
const trainerReview_model_1 = require("../trainerReview/trainerReview.model");
const adminDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const [user, trainer, studio, visitor] = yield Promise.all([
        user_model_1.UserModel.find(),
        trainer_model_1.trainerModel.find(),
        studio_model_1.default.find(),
        adminModel_1.userVisitModel.findOne()
    ]);
    const info = {
        totalUser: user.length,
        totalTrainer: trainer.length,
        totalStudio: studio.length,
        totalVisitor: visitor ? visitor.count : 0,
    };
    return info;
});
const adminStudioRequestDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adminModel_1.adminStudioApproveModel.find({
        action: false
    }).populate('studioId');
    return result;
});
const adminTrainerRequestDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adminModel_1.admintrainerApproveModel.find({
        action: false
    }).populate({
        path: 'trainerId',
        select: 'firstName lastName studioName trainingType'
    });
    return result;
});
const adminApproveRequestDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findStudio = yield adminModel_1.adminStudioApproveModel.findOne({ studioId: id });
    const findTrainer = yield adminModel_1.admintrainerApproveModel.findOne({ trainerId: id });
    if (findStudio) {
        yield studio_model_1.default.findByIdAndUpdate(id, { isApprove: true }, { new: true });
        yield adminModel_1.adminStudioApproveModel.deleteOne({ studioId: id });
    }
    else if (findTrainer) {
        yield trainer_model_1.trainerModel.findByIdAndUpdate(id, { isApprove: true }, { new: true });
        yield adminModel_1.admintrainerApproveModel.deleteOne({ trainerId: id });
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Wrong request');
    }
});
const adminDenyRequestDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findStudio = yield adminModel_1.adminStudioApproveModel.findOne({ studioId: id });
    const findTrainer = yield adminModel_1.admintrainerApproveModel.findOne({ trainerId: id });
    if (findStudio) {
        yield studio_model_1.default.findByIdAndDelete(id);
        yield adminModel_1.adminStudioApproveModel.deleteOne({ studioId: id });
    }
    else if (findTrainer) {
        yield trainer_model_1.trainerModel.findByIdAndDelete(id);
        yield adminModel_1.admintrainerApproveModel.deleteOne({ trainerId: id });
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Wrong request');
    }
});
const deleteReviewsDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const studioReview = yield studioReview_model_1.studioReviewModel.findById(id);
    const trainerReview = yield trainerReview_model_1.trainerReviewModal.findById(id);
    if (studioReview) {
        yield studioReview_model_1.studioReviewModel.findByIdAndDelete(id);
    }
    if (trainerReview) {
        yield trainerReview_model_1.trainerReviewModal.findByIdAndDelete(id);
    }
});
const blockUserDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.findByIdAndUpdate(id, { isblock: true }, { new: true });
    return result;
});
exports.adminService = {
    adminStudioRequestDB,
    adminTrainerRequestDB,
    adminApproveRequestDB,
    adminDenyRequestDB,
    adminDB,
    deleteReviewsDB,
    blockUserDB
};
