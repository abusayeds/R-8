
import { Router } from "express";

import zodValidation from "../../../middlewares/zodValidationHandler";

import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { ctrateTrainerValidation } from "./trainer-validation";
import { trainerController } from "./trainer-controller";
const router = Router();

router.post("/create-trainer", authMiddleware(role.user), zodValidation(ctrateTrainerValidation), trainerController.createTrainer); 
router.get("/trainers",  trainerController.getTrainers);
router.get("/get-trainer/:trainerId",  trainerController.getTrainer); 
router.get("/get-similar-trainer/:trainerType",  trainerController.getSimilarTrainers); 

export const trainerRouts = router;
