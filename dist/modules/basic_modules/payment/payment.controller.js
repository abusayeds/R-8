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
exports.getAllPayment = exports.paymentCreate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
// import stripe from "stripe";
const user_model_1 = require("../user/user.model");
const subscription_model_1 = require("../subscription/subscription.model");
const payment_model_1 = require("./payment.model");
const payment_service_1 = require("./payment.service");
const date_fns_1 = require("date-fns");
const promoCode_model_1 = require("../promoCode/promoCode.model");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const config_1 = require("../../../config");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const socket_1 = require("../../../utils/socket");
exports.paymentCreate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format.");
        }
        const token = authHeader.split(" ")[1]; // Get the token part from the 'Bearer <token>'
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
        const userId = decoded.id; // Assuming the token contains the userId
        const { subscriptionId, amount, transactionId } = req.body; // Accept amount and subscriptionId from body
        if (!transactionId) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Failed to purchase!");
        }
        // Fetch the user by ID
        const user = yield user_model_1.UserModel.findById(userId);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
        }
        if (user.cuponCode) {
            // Fetch the promo code details
            const promoCode = yield promoCode_model_1.PromoCodeModel.findOne({ code: user.cuponCode });
            // Calculate the duration from the promo code
            const numericDuration = parseInt((promoCode === null || promoCode === void 0 ? void 0 : promoCode.duration) || "0", 10);
            const durationUnit = (promoCode === null || promoCode === void 0 ? void 0 : promoCode.duration.includes("year"))
                ? "year"
                : "month";
            // Calculate the end date
            const currentDate = new Date();
            const endDate = new Date(currentDate);
            if (durationUnit === "year") {
                endDate.setFullYear(currentDate.getFullYear() + numericDuration);
            }
            else {
                endDate.setMonth(currentDate.getMonth() + numericDuration);
            }
            // Format the end date as a readable string
            const formattedEndDate = endDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            // Dynamic message based on the duration
            const message = `You have a coupon code. This app is free for you until ${formattedEndDate}!`;
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message, // Use the dynamic message
                data: null,
                pagination: undefined,
            });
        }
        // Validate subscriptionId
        const subscription = yield subscription_model_1.SubscriptionModel.findById(subscriptionId);
        if (!subscription) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subscription not found.");
        }
        // Ensure subscriptionDuration is a number
        const subscriptionDuration = typeof subscription.duration === "number"
            ? subscription.duration
            : parseInt(subscription.duration, 10) || 12;
        const currentDate = new Date();
        const expiryDate = new Date(currentDate);
        expiryDate.setMonth(currentDate.getMonth() + subscriptionDuration);
        // If the day of expiry is invalid (e.g., Feb 31), it will roll over to the next valid day
        if (expiryDate.getDate() !== currentDate.getDate()) {
            expiryDate.setDate(0); // Adjust to the last valid day of the previous month
        }
        // Store the expiry date in both the PaymentModel and UserModel
        const paymentData = {
            transactionId,
            userId: user._id,
            subscriptionId, // Store the subscription ID
            amount, // Payment amount
            date: new Date(),
            expiryDate: expiryDate, // Store the actual Date object for expiry in PaymentModel
            paymentData: {}, // You may want to include actual payment data here
            status: "completed",
            isDeleted: false,
        };
        // Create the payment record
        const newPayment = yield payment_model_1.PaymentModel.create(paymentData);
        // Update the user's expiry date in the UserModel
        yield user_model_1.UserModel.findByIdAndUpdate(userId, {
            expiryDate: expiryDate, // Store the actual expiry date
            activeDate: new Date(), // Store the current date as activeDate
        }, { new: true });
        // Format the expiry date as a readable string for response
        const day = expiryDate.getDate();
        const suffix = day % 10 === 1 && day !== 11
            ? "st"
            : day % 10 === 2 && day !== 12
                ? "nd"
                : day % 10 === 3 && day !== 13
                    ? "rd"
                    : "th";
        const formattedExpiryDate = `${day}${suffix} ${expiryDate.toLocaleString("en-US", { month: "long" })} ${expiryDate.getFullYear()}`;
        // Emit notifications after successful payment
        yield (0, socket_1.emitNotification)({
            userId: user._id,
            userMsg: `You successfully purchased the subscription! It is valid until ${formattedExpiryDate}.`,
            adminMsg: `${user.name} purchased a  subscription with the transaction ID: "${transactionId}".`,
        });
        // Send success response with the formatted expiry date
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "Payment completed successfully!",
            data: Object.assign(Object.assign({}, newPayment.toObject()), { expiryDate: formattedExpiryDate }),
            pagination: undefined,
        });
    }
    catch (error) {
        console.error("Error during payment processing:", error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Internal server error");
    }
}));
exports.getAllPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const name = req.query.name;
    const date = req.query.date;
    const subscriptionName = req.query.subscriptionName;
    const result = yield (0, payment_service_1.getAllPaymentFromDB)(page, limit, name, date, subscriptionName);
    if (result.data.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "No purchased history",
            data: {
                payments: [],
            },
            pagination: {
                totalPage: Math.ceil(result.total / limit),
                currentPage: page,
                prevPage: page > 1 ? page - 1 : 1,
                nextPage: result.data.length === limit ? page + 1 : page,
                limit,
                totalItem: result.total,
            },
        });
    }
    //console.log(result.data,"finding date")
    const formattedPayments = result.data.map((payment) => ({
        transactionId: payment.transactionId,
        amount: payment.amount,
        userName: payment.userName,
        subscriptionName: payment.subscriptionName,
        date: (0, date_fns_1.format)(new Date(payment.createdAt), "do MMMM, yyyy"), // Format the date using date-fns
    }));
    return (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payments retrieved successfully.",
        data: {
            payments: formattedPayments,
        },
        pagination: {
            totalPage: Math.ceil(result.total / limit),
            currentPage: page,
            prevPage: page > 1 ? page - 1 : 1,
            nextPage: result.data.length === limit ? page + 1 : page,
            limit,
            totalItem: result.total,
        },
    });
}));
