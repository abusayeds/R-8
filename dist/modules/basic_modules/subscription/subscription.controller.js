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
exports.getUserSubscriptions = exports.deleteSubscription = exports.updateSubscription = exports.getSubscription = exports.createSubscription = void 0;
const http_status_1 = __importDefault(require("http-status"));
const subscription_model_1 = require("./subscription.model");
const subscription_service_1 = require("./subscription.service");
const payment_model_1 = require("../payment/payment.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../user/user.model");
const promoCode_model_1 = require("../promoCode/promoCode.model");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const config_1 = require("../../../config");
exports.createSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, duration } = req.body;
    // Validate if duration and price are numbers
    if (isNaN(Number(duration))) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Give only a number of how many months you want");
    }
    if (isNaN(Number(price))) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Give correct price");
    }
    // Check for existing subscription based on the language-specific name
    const existingSubscription = yield subscription_model_1.SubscriptionModel.findOne({
        $or: [
            // Case-insensitive search for English name
            { name: { $regex: new RegExp(`^${name}$`, "i") } }, // Case-insensitive search for Spanish name
        ],
    });
    if (existingSubscription) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Subscription with this name already exists");
    }
    // Create the subscription
    const subscription = yield subscription_model_1.SubscriptionModel.create({
        name, // Save the localized name
        price,
        duration,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Subscription created successfully",
        data: subscription,
        pagination: undefined,
    });
}));
exports.getSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { subscriptions, totalSubscriptions, totalPages } = yield (0, subscription_service_1.subscriptionList)(page, limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
    if (subscriptions.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "No subscriptions available.",
            data: [],
            pagination: {
                totalPage: totalPages,
                currentPage: page,
                prevPage: prevPage !== null && prevPage !== void 0 ? prevPage : 1,
                nextPage: nextPage !== null && nextPage !== void 0 ? nextPage : 1,
                limit,
                totalItem: totalSubscriptions,
            },
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Subscriptions retrieved successfully",
        data: subscriptions,
        pagination: {
            totalPage: totalPages,
            currentPage: page,
            prevPage: prevPage !== null && prevPage !== void 0 ? prevPage : 1,
            nextPage: nextPage !== null && nextPage !== void 0 ? nextPage : 1,
            limit,
            totalItem: totalSubscriptions,
        },
    });
}));
exports.updateSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
    const { name, price, duration } = req.body;
    // Validate if duration is a number
    if (duration) {
        if (isNaN(Number(duration))) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Give only a number of how many months you want");
        }
    }
    // Validate if price is a number
    if (price) {
        if (isNaN(Number(price))) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Give correct price");
        }
    }
    // Find subscription by ID
    const subscription = yield (0, subscription_service_1.findSubsById)(id);
    if (!subscription) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subscription not found.");
    }
    // Prepare update data
    const updateData = {};
    if (name)
        updateData.name = name;
    if (duration)
        updateData.duration = duration;
    if (price)
        updateData.price = price;
    // Update subscription
    const updatedSubs = yield (0, subscription_service_1.subsUpdate)(id, updateData);
    // Send success response
    if (updatedSubs) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Subscription updated successfully",
            data: updatedSubs,
            pagination: undefined,
        });
    }
}));
exports.deleteSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
    // Find subscription by ID
    const subscription = yield (0, subscription_service_1.findSubsById)(id);
    if (!subscription) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subscription not found.");
    }
    // Check if the subscription is already deleted
    if (subscription.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subscription is already deleted.");
    }
    // Delete subscription
    yield (0, subscription_service_1.subsDelete)(id);
    // Send success response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Subscription deleted successfully",
        data: null,
    });
}));
exports.getUserSubscriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format.");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = yield user_model_1.UserModel.findById(userId);
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
    // Fetch payments and populate the 'subscriptionId' with the relevant fields
    const payments = yield payment_model_1.PaymentModel.find({ userId }).populate({
        path: "subscriptionId", // Assuming subscriptionId references the Subscription model
        select: "name price duration isDeleted createdAt updatedAt", // Specify the fields to populate
    });
    if (!payments || payments.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "You have no subscriptions.");
    }
    // Map over the payments and format the subscription durations
    const subscriptions = payments
        .map((payment) => {
        const subscription = payment.subscriptionId;
        // Check if subscriptionId exists before accessing its properties
        if (!subscription) {
            return null; // Skip this payment if subscription is null
        }
        const numericDuration = parseInt(subscription.duration, 10);
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
        let formattedDuration = "";
        if (numericDuration <= 12) {
            formattedDuration = `${numericDuration} ${numericDuration === 1 ? "month" : "months"}`;
        }
        else {
            const years = Math.floor(numericDuration / 12);
            const months = numericDuration % 12;
            formattedDuration = `${years} ${years > 1 ? "years" : "year"}`;
            if (months > 0) {
                formattedDuration += ` ${months} ${months > 1 ? "months" : "month"}`;
            }
        }
        // Calculate the end date based on payment.createdAt and subscription duration
        const paymentDate = new Date(payment.createdAt);
        const endDate = new Date(paymentDate);
        endDate.setMonth(paymentDate.getMonth() + numericDuration);
        const formattedEndDate = endDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        // Create the message with the subscription name and active period
        const text = `You have purchased the ${subscription.name.en} plan. The plan is active until ${formattedEndDate}.`;
        return {
            name: subscription.name,
            price: subscription.price,
            duration: formattedDuration,
            text, // Include the dynamic message in the response
            expiryDate: expiryDate,
        };
    })
        .filter((sub) => sub !== null); // Filter out any null subscriptions
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My subscriptions retrieved successfully.",
        data: subscriptions,
    });
}));
