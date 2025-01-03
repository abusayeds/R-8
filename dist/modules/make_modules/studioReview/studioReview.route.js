"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studioReviewRouts = void 0;
const express_1 = require("express");
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const zodValidationHandler_1 = __importDefault(require("../../../middlewares/zodValidationHandler"));
const studioReview_validation_1 = require("./studioReview.validation");
const studioReview_controller_1 = require("./studioReview.controller");
const router = (0, express_1.Router)();
router.post("/create-review", (0, auth_1.authMiddleware)(role_1.role.user), (0, zodValidationHandler_1.default)(studioReview_validation_1.createStudioReviewValidation), studioReview_controller_1.studioReviewController.createStudioReview);
router.get("/single-studio-review/:studioId", studioReview_controller_1.studioReviewController.singleStudioReview);
exports.studioReviewRouts = router;
