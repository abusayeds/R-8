
import { Router } from "express";

import zodValidation from "../../../middlewares/zodValidationHandler";

import { authMiddleware } from "../../../middlewares/auth";
import { ctrateTrainerReviewValidation } from "./trainerReview.validation";
import { trainerRevieewController } from "./trainerReview.controller";
import { role } from "../../../utils/role";

const router = Router();

router.post("/create-trainer-review", authMiddleware(role.user), zodValidation(ctrateTrainerReviewValidation), trainerRevieewController.createTrainerReview); 

export const trainerReviewRouts = router;