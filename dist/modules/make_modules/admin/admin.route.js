"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouts = void 0;
const express_1 = require("express");
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
router.get("/admin", admin_controller_1.adminController.admin);
router.get("/admin-studio-request", (0, auth_1.authMiddleware)(role_1.role.admin), admin_controller_1.adminController.adminStudioRequest);
router.get("/admin-trainer-request", (0, auth_1.authMiddleware)(role_1.role.admin), admin_controller_1.adminController.adminTrainerRequest);
router.post("/admin-approve/:id", (0, auth_1.authMiddleware)(role_1.role.admin), admin_controller_1.adminController.adminApproveRequest);
router.get("/admin-Deny/:id", (0, auth_1.authMiddleware)(role_1.role.admin), admin_controller_1.adminController.adminDenyRequest);
router.delete("/delete-user-review/:reviewId", (0, auth_1.authMiddleware)(role_1.role.admin), admin_controller_1.adminController.deleteReview);
router.post("/user-block/:userId", (0, auth_1.authMiddleware)(role_1.role.admin), admin_controller_1.adminController.blockUser);
exports.adminRouts = router;
