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
Object.defineProperty(exports, "__esModule", { value: true });
exports.studioReviewServise = void 0;
const studioReview_model_1 = require("./studioReview.model");
const createStudioReviewDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield studioReview_model_1.studioReviewModel.create(Object.assign(Object.assign({}, payload), { userId: user.id }));
    return result;
});
const singleStudioReviewDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield studioReview_model_1.studioReviewModel.find({
        studioId: id
    });
    return result;
});
exports.studioReviewServise = {
    singleStudioReviewDB,
    createStudioReviewDB
};
