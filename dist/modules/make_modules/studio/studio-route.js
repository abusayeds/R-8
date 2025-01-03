"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studioRouts = void 0;
const express_1 = require("express");
const studio_controller_1 = require("./studio-controller");
const zodValidationHandler_1 = __importDefault(require("../../../middlewares/zodValidationHandler"));
const studio_validation_1 = require("./studio-validation");
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const router = (0, express_1.Router)();
router.post("/create-studio", (0, auth_1.authMiddleware)(role_1.role.user), (0, zodValidationHandler_1.default)(studio_validation_1.createStudioValidation), studio_controller_1.studioController.createStudio);
router.get("/get-studios", studio_controller_1.studioController.getStudios);
router.get("/get-studio/:studioId", studio_controller_1.studioController.getSingleStudio);
router.get("/get-studio-reviews/:studioId", studio_controller_1.studioController.getStudioReviews);
exports.studioRouts = router;
