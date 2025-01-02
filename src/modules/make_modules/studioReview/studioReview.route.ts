import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import zodValidation from "../../../middlewares/zodValidationHandler";
import { createStudioReviewValidation } from "./studioReview.validation";
import { studioReviewController } from "./studioReview.controller";

const router = Router();
router.post("/create-review", authMiddleware(role.user), zodValidation(createStudioReviewValidation), studioReviewController.createStudioReview);
router.get("/single-studio-review/:studioId",   studioReviewController.singleStudioReview); 
export const studioReviewRouts = router; 