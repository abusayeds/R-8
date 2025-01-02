
import { Router } from "express";
import { studioController } from "./studio-controller";
import zodValidation from "../../../middlewares/zodValidationHandler";
import { createStudioValidation,  } from "./studio-validation";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
const router = Router();
router.post("/create-studio", authMiddleware(role.user), zodValidation(createStudioValidation), studioController.createStudio);
router.get("/get-studios",  studioController.getStudios);
router.get("/get-studio/:studioId",  studioController.getSingleStudio);
router.get("/get-studio-reviews/:studioId",   studioController.getStudioReviews);
export const studioRouts = router;
