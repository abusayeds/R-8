import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { reportController } from "./report.controller";
const router = Router();
router.post("/create-report/:reviewId", authMiddleware(role.user), reportController.createReport);
router.get("/get-all-review-report/:id", authMiddleware(role.admin), reportController.getRevidwReport);
export const reportRouts = router;