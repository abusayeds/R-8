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
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackList = exports.createFeedback = void 0;
const feedback_model_1 = require("./feedback.model");
const createFeedback = (feedbackData) => __awaiter(void 0, void 0, void 0, function* () {
    const promoCode = yield feedback_model_1.FeedbackModel.create(feedbackData);
    return promoCode.toObject(); // Convert to plain object
});
exports.createFeedback = createFeedback;
const feedbackList = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, date, name, email) {
    const skip = (page - 1) * limit;
    const query = { isDeleted: { $ne: true } }; // Filter out promo codes where isDeleted is true
    if (name) {
        query.name = { $regex: name, $options: "i" };
    }
    if (email) {
        query.email = { $regex: email, $options: "i" };
    }
    // Date filtering logic
    if (date) {
        // Parse the input date (DD-MM-YYYY)
        const [day, month, year] = date.split("-").map(Number);
        // Create start and end Date objects
        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Start of the day (00:00:00 UTC)
        const endDate = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, -1)); // End of the day (23:59:59 UTC)
        // Add date filter to query
        query.createdAt = { $gte: startDate, $lte: endDate };
    }
    // Query for promo codes with pagination and filtering
    const feedbacks = yield feedback_model_1.FeedbackModel.aggregate([
        { $match: query },
        {
            $setWindowFields: {
                sortBy: { createdAt: -1 },
                output: {
                    serial: {
                        $documentNumber: {},
                    },
                },
            },
        },
        {
            $project: {
                serial: 1,
                // Include the serial field
                rating: 1, // Include coupon code
                email: 1,
                enjoy: 1,
                heard: 1,
                name: 1,
                feedback: 1, // Include status and duration
                createdAt: 1, // Include createdAt field
            },
        },
        { $skip: skip }, // Skipping records for pagination
        { $limit: limit }, // Limiting the number of records per page
    ]);
    // Get the total number of promo codes for calculating total pages
    const totalFeedbacks = yield feedback_model_1.FeedbackModel.countDocuments(query);
    const totalPages = Math.ceil(totalFeedbacks / limit);
    return { feedbacks, totalFeedbacks, totalPages };
});
exports.feedbackList = feedbackList;
