
import { Router } from "express";

import zodValidation from "../../../middlewares/zodValidationHandler";

import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { ctrateTrainerValidation } from "./trainer-validation";
import { trainerController } from "./trainer-controller";
const router = Router();

router.post("/create-trainer", authMiddleware(role.user), zodValidation(ctrateTrainerValidation), trainerController.createTrainer); 
router.get("/trainers", authMiddleware(role.admin), trainerController.getTrainers);
router.get("/get-trainer/:trainerId", authMiddleware(role.user),  trainerController.getTrainer); 

export const trainerRouts = router;
