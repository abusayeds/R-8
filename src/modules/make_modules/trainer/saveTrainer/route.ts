import { Router } from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { savedTranercontroller } from "./controller";
const router = Router();

router.post("/saved-trainer", authMiddleware(role.user), savedTranercontroller.createSaveTrainer);
router.get("/get-save-trainers/:userId", authMiddleware(role.user) , savedTranercontroller.getSavedTrainer);

export const savedtrainerRouts = router;