"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const zodValidationHandler_1 = __importDefault(require("../../../middlewares/zodValidationHandler"));
const fileUploadNormal_1 = __importDefault(require("../../../middlewares/fileUploadNormal"));
const user_validation_1 = require("./user.validation");
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const router = express_1.default.Router();
router.post("/register", (0, zodValidationHandler_1.default)(user_validation_1.registerUserValidation), user_controller_1.registerUser);
router.post("/signup", (0, zodValidationHandler_1.default)(user_validation_1.registerUserValidation), user_controller_1.signup);
router.post("/login", (0, zodValidationHandler_1.default)(user_validation_1.loginValidation), user_controller_1.loginUser);
router.post("/admin-login", user_controller_1.adminloginUser);
router.post("/forget-password", user_controller_1.forgotPassword);
router.post("/reset-password", user_controller_1.resetPassword);
router.post("/verify-otp", user_controller_1.verifyOTP);
router.post("/resend", user_controller_1.resendOTP);
router.post("/verify-forget-otp", user_controller_1.verifyForgotPasswordOTP);
router.post("/change-password", user_controller_1.changePassword);
router.post("/update", fileUploadNormal_1.default.single("image"), user_controller_1.updateUser);
router.get("/my-profile", user_controller_1.getSelfInfo);
// ** user //
router.get("/all-user", (0, auth_1.authMiddleware)(role_1.role.admin), user_controller_1.getAllUsers);
router.post("/block-user", (0, auth_1.authMiddleware)(role_1.role.admin), user_controller_1.BlockUser);
router.post("/delete", (0, auth_1.authMiddleware)(role_1.role.admin), user_controller_1.deleteUser);
router.get("/user-all-review/:userId", (0, auth_1.authMiddleware)(role_1.role.admin), user_controller_1.getAllUserReview);
router.get("/my-review/:userId", user_controller_1.myReview);
exports.UserRoutes = router;
