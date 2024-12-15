import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { adminController } from "./admin.controller";
const router = Router();
router.get("/admin-studio-request", authMiddleware(role.admin), adminController.adminStudioRequest);
router.get("/admin-trainer-request", authMiddleware(role.admin), adminController.adminTrainerRequest);
router.get("/admin-approve/:id", authMiddleware(role.admin), adminController.adminApproveRequest);
router.get("/admin-Deny/:id", authMiddleware(role.admin), adminController.adminDenyRequest);

export const adminRouts = router;