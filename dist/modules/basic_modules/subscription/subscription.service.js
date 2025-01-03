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
exports.subsDelete = exports.subsUpdate = exports.findSubsById = exports.subscriptionList = void 0;
const subscription_model_1 = require("./subscription.model");
const subscriptionList = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { isDeleted: { $ne: true } }; // Filter out deleted subscriptions
    // Query for subscriptions with pagination
    const subscriptions = yield subscription_model_1.SubscriptionModel.aggregate([
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
            $addFields: {
                numericDuration: { $toInt: "$duration" }, // Convert string to integer directly
            },
        },
        {
            $addFields: {
                formattedDuration: {
                    $cond: {
                        if: { $lte: ["$numericDuration", 12] },
                        then: {
                            $concat: [
                                { $toString: "$numericDuration" },
                                " ",
                                {
                                    $cond: {
                                        if: { $eq: ["$numericDuration", 1] },
                                        then: "month",
                                        else: "months",
                                    },
                                },
                            ],
                        },
                        else: {
                            $let: {
                                vars: {
                                    years: { $floor: { $divide: ["$numericDuration", 12] } },
                                    months: { $mod: ["$numericDuration", 12] },
                                },
                                in: {
                                    $concat: [
                                        { $toString: "$$years" },
                                        " year",
                                        {
                                            $cond: {
                                                if: { $eq: ["$$years", 1] },
                                                then: "",
                                                else: "s",
                                            },
                                        },
                                        {
                                            $cond: {
                                                if: { $gt: ["$$months", 0] },
                                                then: {
                                                    $concat: [
                                                        " ",
                                                        { $toString: "$$months" },
                                                        " month",
                                                        {
                                                            $cond: {
                                                                if: { $eq: ["$$months", 1] },
                                                                then: "",
                                                                else: "s",
                                                            },
                                                        },
                                                    ],
                                                },
                                                else: "",
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            $project: {
                serial: 1, // Include the serial field
                name: 1, // Include subscription name
                price: 1, // Include price
                duration: "$formattedDuration", // Use formattedDuration as duration
                createdAt: 1, // Include createdAt field
            },
        },
        { $skip: skip }, // Skipping records for pagination
        { $limit: limit }, // Limiting the number of records per page
    ]);
    // Get the total number of subscriptions for calculating total pages
    const totalSubscriptions = yield subscription_model_1.SubscriptionModel.countDocuments(query);
    const totalPages = Math.ceil(totalSubscriptions / limit);
    //console.log(subscriptions); // Log the result for debugging
    return { subscriptions, totalSubscriptions, totalPages };
});
exports.subscriptionList = subscriptionList;
const findSubsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subscription_model_1.SubscriptionModel.findById(id);
    return subscription ? subscription.toObject() : null; // Convert to plain object
});
exports.findSubsById = findSubsById;
const subsUpdate = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedSubs = yield subscription_model_1.SubscriptionModel.findByIdAndUpdate(id, updateData, { new: true });
    return updatedSubs ? updatedSubs.toObject() : null; // Convert to plain object
});
exports.subsUpdate = subsUpdate;
const subsDelete = (Id) => __awaiter(void 0, void 0, void 0, function* () {
    yield subscription_model_1.SubscriptionModel.findByIdAndUpdate(Id, { isDeleted: true });
});
exports.subsDelete = subsDelete;
