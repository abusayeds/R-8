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
exports.signupDB = exports.myReviewDB = exports.usarallReview = exports.allUsers = exports.userDelete = exports.changeUserRole = exports.verifyPassword = exports.sendOTPEmail = exports.generateToken = exports.hashPassword = exports.getUserRegistrationDetails = exports.getStoredOTP = exports.saveOTP = exports.generateOTP = exports.getUserList = exports.updateUserById = exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../../config");
const user_model_1 = require("./user.model");
const studioReview_model_1 = require("../../make_modules/studioReview/studioReview.model");
const trainerReview_model_1 = require("../../make_modules/trainerReview/trainerReview.model");
const studio_constant_1 = require("../../make_modules/studio/studio.constant");
const report_model_1 = __importDefault(require("../../make_modules/report/report.model"));
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fristName, lastName, email, hashedPassword, }) {
    const createdUser = yield user_model_1.UserModel.create({
        fristName,
        lastName,
        email,
        password: hashedPassword,
    });
    return { createdUser };
});
exports.createUser = createUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.UserModel.findOne({ email });
});
exports.findUserByEmail = findUserByEmail;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.UserModel.findById(id);
});
exports.findUserById = findUserById;
const updateUserById = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.UserModel.findByIdAndUpdate(id, updateData, { new: true });
});
exports.updateUserById = updateUserById;
const getUserList = (adminId, skip, limit, date, name, email) => __awaiter(void 0, void 0, void 0, function* () {
    //const query: any = { isDeleted: { $ne: true } }
    //const query: any = { _id: { $ne: adminId } };
    const query = {
        $and: [{ isDeleted: { $ne: true } }, { isblock: { $ne: true } }, { _id: { $ne: adminId } }],
    };
    if (date) {
        // Parse the input date (DD-MM-YYYY)
        const [day, month, year] = date.split("-").map(Number);
        // Create a Date object representing the start of the day in UTC
        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        // Create a Date object representing the end of the day in UTC
        const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
        query.createdAt = { $gte: startDate, $lte: endDate };
    }
    if (name) {
        query.name = { $regex: name, $options: "i" };
    }
    if (email) {
        query.email = { $regex: email, $options: "i" };
    }
    const users = yield user_model_1.UserModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const totalUsers = yield user_model_1.UserModel.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    return { users, totalUsers, totalPages };
});
exports.getUserList = getUserList;
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`otp is hear ${otp}`);
    return otp;
};
exports.generateOTP = generateOTP;
const saveOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.OTPModel.findOneAndUpdate({ email }, { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }, { upsert: true, new: true });
});
exports.saveOTP = saveOTP;
const getStoredOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const otpRecord = yield user_model_1.OTPModel.findOne({ email });
    return otpRecord ? otpRecord.otp : null;
});
exports.getStoredOTP = getStoredOTP;
const getUserRegistrationDetails = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.PendingUserModel.findOne({ email });
});
exports.getUserRegistrationDetails = getUserRegistrationDetails;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.hash(password, 12);
});
exports.hashPassword = hashPassword;
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.JWT_SECRET_KEY, { expiresIn: "7d" });
};
exports.generateToken = generateToken;
const sendOTPEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: config_1.Nodemailer_GMAIL,
            pass: config_1.Nodemailer_GMAIL_PASSWORD,
        },
    });
    // English and Spanish email content based on the lang parameter
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f0f0; padding: 20px;">
      <h1 style="text-align: center; color: #452778; font-family: 'Times New Roman', Times, serif;">
        Like<span style="color:black; font-size: 0.9em;">Mine</span>
      </h1>
      <div style="background-color: white; padding: 20px; border-radius: 5px;">
        <h2 style="color:#d3b06c">Hello!</h2>
        <p>You are receiving this email because we received a registration request for your account.</p>
        <div style="text-align: center; margin: 20px 0;">
          <h3>Your OTP is: <strong>${otp}</strong></h3>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request this, no further action is required.</p>
        <p>Regards,<br>LikeMine</p>
      </div>
      <p style="font-size: 12px; color: #666; margin-top: 10px;">If you're having trouble copying the OTP, please try again.</p>
    </div>
  `;
    const mailOptions = {
        from: "khansourav58@gmail.com",
        to: email,
        subject: "Registration OTP",
        html: emailContent,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendOTPEmail = sendOTPEmail;
const verifyPassword = (inputPassword, storedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(inputPassword, storedPassword);
});
exports.verifyPassword = verifyPassword;
const changeUserRole = (userId, newRole) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.UserModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });
});
exports.changeUserRole = changeUserRole;
const userDelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.UserModel.findByIdAndUpdate(id, { isDeleted: true });
});
exports.userDelete = userDelete;
const allUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.find();
    return result;
});
exports.allUsers = allUsers;
const usarallReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studioReviews = yield studioReview_model_1.studioReviewModel.find({ userId: id }).populate({
            path: 'studioId',
            select: 'studioName',
        });
        const userStudioReview = yield Promise.all(studioReviews.map((review) => __awaiter(void 0, void 0, void 0, function* () {
            const reviewData = review.toObject();
            const reportCount = yield report_model_1.default.countDocuments({ reviewId: review._id.toString() });
            return Object.assign(Object.assign({}, (0, studio_constant_1.calculateReviewQuality)(reviewData)), { reportLength: reportCount });
        })));
        // Fetch trainer reviews for the user
        const trainerReviews = yield trainerReview_model_1.trainerReviewModal.find({ userId: id }).populate({
            path: 'trainerId',
            select: 'firstName',
        });
        const userTrainerReview = yield Promise.all(trainerReviews.map((review) => __awaiter(void 0, void 0, void 0, function* () {
            const reviewData = review.toObject();
            const reportCount = yield report_model_1.default.countDocuments({ reviewId: review._id.toString() });
            return Object.assign(Object.assign({}, reviewData), { reportLength: reportCount });
        })));
        // Combine studio reviews, trainer reviews
        const combinedReviews = [...userStudioReview, ...userTrainerReview];
        return combinedReviews;
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        throw new Error('Failed to fetch reviews');
    }
});
exports.usarallReview = usarallReview;
const myReviewDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const trainer = yield trainerReview_model_1.trainerReviewModal.find({ userId: id }).populate({
        path: "trainerId",
        select: "firstName lastName studioName  studioId ",
    });
    const studio = yield studioReview_model_1.studioReviewModel.find({ userId: id }).populate({
        path: "studioId",
        select: "studioName ",
    });
    return {
        trainer, studio
    };
});
exports.myReviewDB = myReviewDB;
const signupDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.create(payload);
    return result;
});
exports.signupDB = signupDB;
