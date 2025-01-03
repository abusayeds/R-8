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
exports.usePromoCode = exports.restorePromoCode = exports.deletePromoCode = exports.updatePromoCode = exports.getPromoCode = exports.createPromoCode = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const promoCode_service_1 = require("./promoCode.service");
const user_service_1 = require("../user/user.service");
const promoCode_model_1 = require("./promoCode.model");
const user_model_1 = require("../user/user.model");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const config_1 = require("../../../config");
exports.createPromoCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, duration } = req.body;
    const existingPromoCode = yield (0, promoCode_service_1.findPromoCodeByCode)(code);
    if (existingPromoCode) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cupon code already exists");
    }
    const promoCode = yield (0, promoCode_service_1.promoCodeCreate)({ code, duration });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Cupon code created successfully",
        data: promoCode,
        pagination: undefined,
    });
}));
exports.getPromoCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const date = req.query.date;
    const duration = req.query.duration;
    const { promoCodes, totalPromoCodes, totalPages } = yield (0, promoCode_service_1.promoCodesList)(page, limit, date, duration);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
    if (promoCodes.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "No Cupon codes available.",
            data: [],
            pagination: {
                totalPage: totalPages,
                currentPage: page,
                prevPage: prevPage !== null && prevPage !== void 0 ? prevPage : 1,
                nextPage: nextPage !== null && nextPage !== void 0 ? nextPage : 1,
                limit,
                totalItem: totalPromoCodes,
            },
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cupon codes retrieved successfully",
        data: promoCodes,
        pagination: {
            totalPage: totalPages,
            currentPage: page,
            prevPage: prevPage !== null && prevPage !== void 0 ? prevPage : 1,
            nextPage: nextPage !== null && nextPage !== void 0 ? nextPage : 1,
            limit,
            totalItem: totalPromoCodes,
        },
    });
}));
exports.updatePromoCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
    const { code, duration } = req.body;
    const promoCode = yield (0, promoCode_service_1.findPromoCodeById)(id);
    if (!promoCode) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Cupon code not found.");
    }
    const updateData = {};
    if (code)
        updateData.code = code;
    if (duration)
        updateData.duration = duration;
    const updatedPromoCode = yield (0, promoCode_service_1.promoCodeUpdate)(id, updateData);
    if (updatedPromoCode) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Cupon code updated successfully",
            data: updatedPromoCode,
            pagination: undefined,
        });
    }
}));
exports.deletePromoCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
    const promoCode = yield (0, promoCode_service_1.findPromoCodeById)(id);
    if (!promoCode) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Cupon code not found.");
    }
    if (promoCode.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Cupon code is already deleted.");
    }
    yield (0, promoCode_service_1.promoCodeDelete)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cupon deleted successfully",
        data: null,
    });
}));
exports.restorePromoCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
    const promoCode = yield (0, promoCode_service_1.findPromoCodeById)(id);
    if (!promoCode) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Cupon code not found.");
    }
    if (!promoCode.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Cupon code is already restored.");
    }
    yield (0, promoCode_service_1.promoCodeRestore)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cupon restore successfully",
        data: null,
    });
}));
exports.usePromoCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format.");
    }
    const token = authHeader.split(" ")[1];
    // Decode the token to get the user ID
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const userId = decoded.id;
    // Find the user by userId
    const user = yield (0, user_service_1.findUserById)(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    const { cuponCode } = req.body;
    // Check if the promo code exists in the database
    const existingPromoCode = yield promoCode_model_1.PromoCodeModel.findOne({ code: cuponCode });
    if (!existingPromoCode) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Coupon code does not exist.");
    }
    // Check if the promo code has already been used
    if (existingPromoCode.status === "used") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This coupon code has already been used by another user.");
    }
    // Parse the duration from the promo code (stored in months)
    const numericDuration = parseInt(existingPromoCode.duration, 10); // Assuming duration is stored as a string number
    // Calculate the expiry date by adding the duration in months
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(currentDate.getMonth() + numericDuration);
    // If the day of expiry is invalid (e.g., Feb 31), it will roll over to the next valid day
    if (expiryDate.getDate() !== currentDate.getDate()) {
        expiryDate.setDate(0); // Adjust to the last valid day of the previous month
    }
    // Store the expiry date in the database as a Date object
    const updatedUser = yield user_model_1.UserModel.findByIdAndUpdate(userId, {
        cuponCode: existingPromoCode.code,
        activeDate: new Date(),
        expiryDate: expiryDate, // Store the actual Date object in the user's document
    }, { new: true });
    // Format the expiry date as a readable string with "17th October 2025" format for the response
    const day = expiryDate.getDate();
    const suffix = day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
            ? "nd"
            : day % 10 === 3 && day !== 13
                ? "rd"
                : "th";
    const formattedExpiryDate = `${day}${suffix} ${expiryDate.toLocaleString("en-US", { month: "long" })} ${expiryDate.getFullYear()}`;
    // Update promo code status to 'used'
    yield promoCode_model_1.PromoCodeModel.findByIdAndUpdate(existingPromoCode._id, {
        status: "used",
        activeDate: new Date(),
        expiryDate: expiryDate,
        userId: userId,
    }, { new: true });
    // Create dynamic success message with the formatted expiry date for response
    const text = `Congratulations, ${user.fristName}${user.lastName}! You have successfully redeemed the coupon code "${cuponCode}". The coupon is valid for ${numericDuration} month(s) and will expire on ${formattedExpiryDate}. Enjoy the benefits!`;
    // Send success response with the formatted expiry date
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: text,
        data: Object.assign(Object.assign({}, updatedUser.toObject()), { expiryDate }),
    });
}));
