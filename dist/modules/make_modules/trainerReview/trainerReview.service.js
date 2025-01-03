"use strict";
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerReviewService = void 0;
const trainerReview_model_1 = require("./trainerReview.model");
const createTrainerReviewDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trainerReview_model_1.trainerReviewModal.create(Object.assign(Object.assign({}, payload), { userId: user.id }));
    return result;
});
const singleTrainerReviewDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trainerReview_model_1.trainerReviewModal.find({
        trainerId: id
    });
    return result;
});
exports.trainerReviewService = {
    createTrainerReviewDB,
    singleTrainerReviewDB
};
