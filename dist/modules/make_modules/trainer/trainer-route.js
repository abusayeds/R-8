"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerRouts = void 0;
const express_1 = require("express");
const zodValidationHandler_1 = __importDefault(require("../../../middlewares/zodValidationHandler"));
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const trainer_validation_1 = require("./trainer-validation");
const trainer_controller_1 = require("./trainer-controller");
const router = (0, express_1.Router)();
router.post("/create-trainer", (0, auth_1.authMiddleware)(role_1.role.user), (0, zodValidationHandler_1.default)(trainer_validation_1.ctrateTrainerValidation), trainer_controller_1.trainerController.createTrainer);
router.get("/trainers", trainer_controller_1.trainerController.getTrainers);
router.get("/get-trainer/:trainerId", trainer_controller_1.trainerController.getTrainer);
router.get("/get-similar-trainer/:trainerType", trainer_controller_1.trainerController.getSimilarTrainers);
exports.trainerRouts = router;
