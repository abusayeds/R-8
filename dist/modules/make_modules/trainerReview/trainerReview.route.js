"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerReviewRouts = void 0;
const express_1 = require("express");
const zodValidationHandler_1 = __importDefault(require("../../../middlewares/zodValidationHandler"));
const auth_1 = require("../../../middlewares/auth");
const trainerReview_validation_1 = require("./trainerReview.validation");
const trainerReview_controller_1 = require("./trainerReview.controller");
const role_1 = require("../../../utils/role");
const router = (0, express_1.Router)();
router.post("/create-trainer-review", (0, auth_1.authMiddleware)(role_1.role.user), (0, zodValidationHandler_1.default)(trainerReview_validation_1.ctrateTrainerReviewValidation), trainerReview_controller_1.trainerRevieewController.createTrainerReview);
router.get("/single-trainer-review/:trainerId", trainerReview_controller_1.trainerRevieewController.singleTrainerReview);
exports.trainerReviewRouts = router;
