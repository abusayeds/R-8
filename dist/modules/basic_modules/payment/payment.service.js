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
exports.getAllPaymentFromDB = void 0;
const payment_model_1 = require("./payment.model");
const getAllPaymentFromDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, name, date, subscriptionName) {
    var _a;
    const skip = (page - 1) * limit;
    const query = { isDeleted: false };
    if (name) {
        query["userDetails.name"] = { $regex: name, $options: "i" }; // Correct the field path for user name search
    }
    if (subscriptionName) {
        query["subscriptionDetails.name"] = {
            $regex: subscriptionName,
            $options: "i",
        }; // Correct the field path for subscription name search
    }
    if (date) {
        const [day, month, year] = date.split("-").map(Number);
        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, -1));
        query.createdAt = { $gte: startDate, $lte: endDate };
    }
    const payments = yield payment_model_1.PaymentModel.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "subscriptions",
                localField: "subscriptionId",
                foreignField: "_id",
                as: "subscriptionDetails",
            },
        },
        {
            $unwind: {
                path: "$subscriptionDetails",
                preserveNullAndEmptyArrays: true,
            },
        },
        { $match: query }, // Apply the query after $lookup and $unwind
        {
            $project: {
                transactionId: 1,
                amount: 1,
                createdAt: 1,
                userName: "$userDetails.name",
                subscriptionName: "$subscriptionDetails.name",
            },
        },
        { $sort: { date: -1 } },
        { $skip: skip },
        { $limit: limit },
    ]);
    const totalPayments = yield payment_model_1.PaymentModel.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "subscriptions",
                localField: "subscriptionId",
                foreignField: "_id",
                as: "subscriptionDetails",
            },
        },
        {
            $unwind: {
                path: "$subscriptionDetails",
                preserveNullAndEmptyArrays: true,
            },
        },
        { $match: query },
        { $count: "total" },
    ]);
    return { data: payments, total: ((_a = totalPayments[0]) === null || _a === void 0 ? void 0 : _a.total) || 0 };
});
exports.getAllPaymentFromDB = getAllPaymentFromDB;
