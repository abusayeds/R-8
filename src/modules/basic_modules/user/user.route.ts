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
  adminloginUser,
  BlockUser,
  getAllUsers,
  deleteUser,
  getAllUserReview,
} from "./user.controller";

import zodValidation from "../../../middlewares/zodValidationHandler";
import upload from "../../../middlewares/fileUploadNormal";
import { loginValidation, registerUserValidation } from "./user.validation";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
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

// ** user //
router.get("/all-user", authMiddleware(role.admin), getAllUsers);
router.post("/block-user", authMiddleware(role.admin), BlockUser);
router.post("/delete", authMiddleware(role.admin), deleteUser);
router.get("/user-all-review/:userId", authMiddleware(role.admin), getAllUserReview);


export const UserRoutes = router;
