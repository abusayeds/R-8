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
exports.getMyNotification = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("../user/user.service");
const notification_model_1 = require("./notification.model");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
exports.getMyNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format.");
    }
    const token = authHeader.split(" ")[1]; // Get the token part from 'Bearer <token>'
    try {
        // Decode the token to get the user ID
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        // Find the user by userId
        const user = yield (0, user_service_1.findUserById)(userId);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
        }
        // Pagination logic
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;
        let notifications;
        let totalNotifications;
        if (user.role === "admin") {
            // For admin, fetch all admin messages
            notifications = yield notification_model_1.NotificationModel.find({
                adminMsg: { $exists: true },
            })
                .select("adminMsg createdAt updatedAt")
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order
                .skip(skip)
                .limit(limit);
            totalNotifications = yield notification_model_1.NotificationModel.countDocuments({
                adminMsg: { $exists: true },
            });
        }
        else {
            // For regular users, fetch their specific notifications
            notifications = yield notification_model_1.NotificationModel.find({ userId: userId })
                .select("userId userMsg createdAt updatedAt")
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order
                .skip(skip)
                .limit(limit);
            totalNotifications = yield notification_model_1.NotificationModel.countDocuments({
                userId: userId,
            });
        }
        // Calculate total pages
        const totalPages = Math.ceil(totalNotifications / limit);
        // Format the notifications
        const formattedNotifications = notifications.map((notification) => ({
            _id: notification._id,
            msg: user.role === "admin" ? notification.adminMsg : notification.userMsg,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
        }));
        // Check if notifications is empty
        if (formattedNotifications.length === 0) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "You have no notifications.",
                data: {
                    notifications: [],
                    currentPage: page,
                    totalPages,
                    totalNotifications,
                    limit,
                },
            });
        }
        // Pagination logic for prevPage and nextPage
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        // Send response with pagination details
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Here is your notifications.",
            data: {
                notifications: formattedNotifications,
                pagination: {
                    totalPages,
                    currentPage: page,
                    prevPage: prevPage !== null && prevPage !== void 0 ? prevPage : 1,
                    nextPage: nextPage !== null && nextPage !== void 0 ? nextPage : 1,
                    limit,
                    totalNotifications,
                },
            },
        });
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token or token expired.");
    }
}));
