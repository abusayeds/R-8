"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myReview = exports.signup = exports.getAllUserReview = exports.adminloginUser = exports.deleteUser = exports.BlockUser = exports.getAllUsers = exports.getSelfInfo = exports.updateUser = exports.changePassword = exports.verifyForgotPasswordOTP = exports.verifyOTP = exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.resendOTP = exports.registerUser = void 0;
const user_service_1 = require("./user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_service_2 = require("./user.service");
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const config_1 = require("../../../config");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const socket_1 = require("../../../utils/socket");
exports.registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Passwords do not match');
    }
    const isUserRegistered = yield (0, user_service_2.findUserByEmail)(email);
    if (isUserRegistered) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You already have an account.");
    }
    yield user_model_1.PendingUserModel.findOneAndUpdate({ email }, {
        name,
        email,
        password,
        confirmPassword,
    }, { upsert: true });
    const otp = (0, user_service_2.generateOTP)();
    yield (0, user_service_2.saveOTP)(email, otp);
    yield (0, user_service_2.sendOTPEmail)(email, otp);
    const token = jsonwebtoken_1.default.sign({ email }, config_1.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "OTP sent to your email. Please verify to continue registration.",
        data: { token },
    });
}));
exports.resendOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format.");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const email = decoded.email;
    if (!email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide a valid email address.");
    }
    const pendingUser = yield user_model_1.PendingUserModel.findOne({ email });
    if (!pendingUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No pending registration found for this email.");
    }
    const newOTP = (0, user_service_2.generateOTP)();
    yield (0, user_service_2.saveOTP)(email, newOTP);
    yield (0, user_service_2.sendOTPEmail)(email, newOTP);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "A new OTP has been sent to your email.",
        data: { token },
    });
}));
exports.loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield (0, user_service_2.findUserByEmail)(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This account does not exist.");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "your account is deleted by admin.");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Wrong password!");
    }
    const token = (0, user_service_2.generateToken)({
        id: user._id,
        fristName: user.fristName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        image: user === null || user === void 0 ? void 0 : user.image,
        address: user === null || user === void 0 ? void 0 : user.address,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Login complete!",
        data: {
            user: {
                id: user._id,
                fristName: user.fristName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                image: user === null || user === void 0 ? void 0 : user.image,
                address: user === null || user === void 0 ? void 0 : user.address,
            },
            token,
        },
    });
}));
exports.forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide an email.");
    }
    const user = yield (0, user_service_2.findUserByEmail)(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This account does not exist.");
    }
    const otp = (0, user_service_2.generateOTP)();
    yield (0, user_service_2.saveOTP)(email, otp);
    const token = jsonwebtoken_1.default.sign({ email }, config_1.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: config_1.Nodemailer_GMAIL,
            pass: config_1.Nodemailer_GMAIL_PASSWORD,
        },
    });
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f0f0; padding: 20px;">
      <h1 style="text-align: center; color: #452778; font-family: 'Times New Roman', Times, serif;">
        Like<span style="color:black; font-size: 0.9em;">Mine</span>
      </h1>
      <div style="background-color: white; padding: 20px; border-radius: 5px;">
        <h2 style="color:#d3b06c">Hello!</h2>
        <p>You are receiving this email because we received a password reset request for your account.</p>
        <div style="text-align: center; margin: 20px 0;">
          <h3>Your OTP is: <strong>${otp}</strong></h3>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request a password reset, no further action is required.</p>
        <p>Regards,<br>LikeMine</p>
      </div>
      <p style="font-size: 12px; color: #666; margin-top: 10px;">If you're having trouble copying the OTP, please try again.</p>
    </div>
  `;
    const receiver = {
        from: "khansourav58@gmail.com",
        to: email,
        subject: "Reset Password OTP",
        html: emailContent,
    };
    yield transporter.sendMail(receiver);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "OTP sent to your email. Please check!",
        data: {
            token: token,
        },
    });
}));
exports.resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    const { email, } = decoded;
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide both password and confirmPassword.");
    }
    if (password !== confirmPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Passwords do not match.");
    }
    const user = yield (0, user_service_2.findUserByEmail)(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    const newPassword = yield (0, user_service_2.hashPassword)(password);
    user.password = newPassword;
    yield user.save();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password reset successfully.",
        data: null,
    });
}));
exports.verifyOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format  ");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const email = decoded.email;
    const storedOTP = yield (0, user_service_2.getStoredOTP)(email);
    if (!storedOTP || storedOTP !== otp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid or expired OTP");
    }
    const { fristName, lastName, password } = (yield (0, user_service_2.getUserRegistrationDetails)(email));
    //console.log(objective, "objective from controller");
    const hashedPassword = yield (0, user_service_2.hashPassword)(password);
    const { createdUser } = yield (0, user_service_2.createUser)({
        fristName,
        lastName,
        email,
        hashedPassword,
    });
    const userMsg = "Welcome to LikeMine_App.";
    const adminMsg = `${name} has successfully registered.`;
    yield (0, socket_1.emitNotification)({
        userId: createdUser._id,
        userMsg,
        adminMsg,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Registration successful.",
        data: null,
    });
}));
exports.verifyForgotPasswordOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { otp } = req.body;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    const { email, } = decoded;
    const otpRecord = yield user_model_1.OTPModel.findOne({ email });
    if (!otpRecord) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const currentTime = new Date();
    if (otpRecord.expiresAt < currentTime) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "OTP has expired");
    }
    if (otpRecord.otp !== otp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Wrong OTP");
    }
    return (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "OTP verified successfully.",
        data: null,
    });
}));
exports.changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format.");
    }
    const token = authHeader.split(" ")[1];
    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide old password, new password, and confirm password.");
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const email = decoded.email;
    const user = yield (0, user_service_2.findUserByEmail)(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    const isMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Old password is incorrect.");
    }
    if (newPassword !== confirmPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "New password and confirm password do not match.");
    }
    const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 12);
    user.password = hashedNewPassword;
    yield user.save();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "You have successfully changed the password.",
        data: null,
    });
}));
exports.updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fristName, lastName, address, bio, age, about, gender } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format.");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = yield (0, user_service_2.findUserById)(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    const updateData = {};
    if (fristName)
        updateData.fristName = fristName;
    if (lastName)
        updateData.lastName = lastName;
    if (address)
        updateData.address = address;
    if (bio)
        updateData.bio = bio;
    if (age)
        updateData.age = age;
    if (about)
        updateData.about = about;
    if (gender)
        updateData.gender = gender;
    if (req.file) {
        const imagePath = `public\\images\\${req.file.filename}`;
        const publicFileURL = `/images/${req.file.filename}`;
        updateData.image = {
            path: imagePath,
            publicFileURL: publicFileURL,
        };
    }
    const updatedUser = yield (0, user_service_2.updateUserById)(userId, updateData);
    if (updatedUser) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Profile updated.",
            data: updatedUser,
            pagination: undefined,
        });
    }
}));
exports.getSelfInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format.");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = yield (0, user_service_2.findUserById)(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "profile information retrieved successfully",
        data: user,
        pagination: undefined,
    });
}));
exports.getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   throw new AppError(httpStatus.UNAUTHORIZED,
    //     "No token provided or invalid format.",
    //   );
    // }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const adminId = decoded.id;
    // Find the user by userId
    const user = yield (0, user_service_2.findUserById)(adminId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This admin account doesnot exist.");
    }
    // Check if the user is an admin
    if (user.role !== "admin") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only admins can access the user list.");
    }
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Optional filters
    const date = req.query.date;
    const name = req.query.name;
    const email = req.query.email;
    // Get users with pagination
    const { users, totalUsers, totalPages } = yield (0, user_service_2.getUserList)(adminId, skip, limit, date, name, email);
    // Pagination logic for prevPage and nextPage
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
    // Send response with pagination details
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User list retrieved successfully",
        data: users,
        pagination: {
            totalPage: totalPages,
            currentPage: page,
            prevPage: prevPage !== null && prevPage !== void 0 ? prevPage : 1,
            nextPage: nextPage !== null && nextPage !== void 0 ? nextPage : 1,
            limit,
            totalItem: totalUsers,
        },
    });
}));
exports.BlockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format.");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const adminId = decoded.id;
    const requestingUser = yield user_model_1.UserModel.findById(adminId);
    if (!requestingUser || requestingUser.role !== "admin") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Unauthorized: Only admins can change user status.");
    }
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    if (user.role === "admin") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Cannot change status of an admin user.");
    }
    // Toggle the status
    user.status = user.status === "active" ? "blocked" : "active";
    yield user.save();
    // const userMsg =
    //   user.status === "blocked"
    //     ? "Your account has been blocked by an admin."
    //     : "Your account has been unblocked by an admin.";
    // Uncomment this when you're ready to use the notification function
    // await emitNotificationForChangeUserRole({
    //   userId,
    //   userMsg,
    // });
    return (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User status changed to ${user.status} successfully.`,
        data: null,
        pagination: undefined,
    });
}));
exports.deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
    const user = yield (0, user_service_2.findUserById)(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user not found .");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user  is already deleted.");
    }
    yield (0, user_service_2.userDelete)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "user deleted successfully",
        data: null,
    });
}));
//admin-login
exports.adminloginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // const lang = req.headers.lang as string;
    // // Check language validity
    // if (!lang || (lang !== "es" && lang !== "en")) {
    //  throw new AppError(httpStatus.BAD_REQUEST, {
    //      "Choose a language",
    //   );
    // }
    const user = yield (0, user_service_2.findUserByEmail)(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This account does not exist.");
    }
    if (user.role !== "admin") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only admins can login.");
    }
    // Check password validity
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 
        // lang === "es" ? "¡Contraseña incorrecta!" :
        "Wrong password!");
    }
    // Generate new token for the logged-in user
    const newToken = (0, user_service_2.generateToken)({
        id: user._id,
        fristName: user.fristName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        image: user === null || user === void 0 ? void 0 : user.image,
        // lang: lang,
    });
    // Send the response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 
        // lang === "es" ? "¡Inicio de sesión completo!" :
        "Login complete!",
        data: {
            user: {
                id: user._id,
                fristName: user.fristName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                image: user === null || user === void 0 ? void 0 : user.image,
            },
            token: newToken,
        },
    });
}));
exports.getAllUserReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield (0, user_service_2.usarallReview)(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: " Get All User Review successfully !",
        data: result,
    });
}));
exports.signup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, user_service_2.signupDB)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: " sing up successfully !",
        data: result,
    });
}));
exports.myReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield (0, user_service_1.myReviewDB)(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: " Get All  successfully !",
        data: result,
    });
}));
