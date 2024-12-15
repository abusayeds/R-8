import express from "express";
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
  verifyForgotPasswordOTP,
  changePassword,
  updateUser,
  getSelfInfo,
  getAllUsers,
  BlockUser,
  deleteUser,
  adminloginUser,
} from "./user.controller";

import zodValidation from "../../../middlewares/zodValidationHandler";
import upload from "../../../middlewares/fileUploadNormal";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { loginValidation, registerUserValidation } from "./user.validation";
const router = express.Router();
router.post("/register", zodValidation(registerUserValidation), registerUser,);
router.post("/login", zodValidation(loginValidation), loginUser);
router.post("/admin-login", adminloginUser);
router.post("/forget-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOTP);
router.post("/resend", resendOTP);
router.post("/verify-forget-otp", verifyForgotPasswordOTP);
router.post("/change-password", changePassword);
router.post("/update", upload.single("image"), updateUser);
router.get("/my-profile", getSelfInfo);
router.get("/all-user", authMiddleware(role.admin), getAllUsers);
router.post("/block-user", authMiddleware(role.admin), BlockUser);
router.post("/delete", authMiddleware(role.admin), deleteUser);

export const UserRoutes = router;
