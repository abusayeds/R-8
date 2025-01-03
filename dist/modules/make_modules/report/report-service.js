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
exports.reportService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const studioReview_model_1 = require("../studioReview/studioReview.model");
const trainerReview_model_1 = require("../trainerReview/trainerReview.model");
const report_model_1 = __importDefault(require("./report.model"));
const user_model_1 = require("../../basic_modules/user/user.model");
const createReportDB = (id, user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ifStudioReview = yield studioReview_model_1.studioReviewModel.findById(id);
    const ifTrainerReview = yield trainerReview_model_1.trainerReviewModal.findById(id);
    if (ifStudioReview) {
        yield user_model_1.UserModel.findByIdAndUpdate(ifStudioReview === null || ifStudioReview === void 0 ? void 0 : ifStudioReview.userId, { $inc: { report: 1 } });
        const result = yield report_model_1.default.create(Object.assign(Object.assign({}, payload), { reportUser: user.id, reviewId: id, userId: ifStudioReview === null || ifStudioReview === void 0 ? void 0 : ifStudioReview.userId }));
        return result;
    }
    else if (ifTrainerReview) {
        yield user_model_1.UserModel.findByIdAndUpdate(ifTrainerReview === null || ifTrainerReview === void 0 ? void 0 : ifTrainerReview.userId, { $inc: { report: 1 } });
        const result = yield report_model_1.default.create(Object.assign(Object.assign({}, payload), { reviewId: id, userId: ifTrainerReview === null || ifTrainerReview === void 0 ? void 0 : ifTrainerReview.userId }));
        return result;
    }
    else {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This review not found !");
    }
});
const getRevidwReportDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield report_model_1.default.find({ reviewId: id }).populate({
        path: "reportUser",
        select: "name email",
    });
    return result;
});
exports.reportService = {
    createReportDB,
    getRevidwReportDB
};
