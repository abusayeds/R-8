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
/* eslint-disable @typescript-eslint/no-explicit-any */
// import path from "path";
// Import the 'express' module
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const adminModel_1 = require("./modules/make_modules/admin/adminModel");
const logger_1 = require("./logger/logger");
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.static("public"));
app.use(logger_1.logHttpRequests);
app.use(routes_1.default);
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let visitor = yield adminModel_1.userVisitModel.findOne();
        if (!visitor) {
            visitor = new adminModel_1.userVisitModel();
        }
        const visitorId = req.cookies.visitorId;
        if (!visitorId) {
            const newVisitorId = `visitor_${Date.now()}`;
            res.cookie("visitorId", newVisitorId, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true });
            visitor.count += 1;
            visitor.uniqueVisitors.push(newVisitorId);
            yield visitor.save();
        }
        next();
    }
    catch (err) {
        console.error("Error updating visitor count", err);
        next();
    }
}));
const resetVisitorData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield adminModel_1.userVisitModel.findOne();
            if (visitor) {
                visitor.count = 0;
                visitor.uniqueVisitors = [];
                yield visitor.save();
                console.log('Visitor count and list reset successfully!');
            }
        }), 86400000);
    }
    catch (err) {
        console.error("Error resetting visitor data:", err);
    }
});
resetVisitorData();
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info("Root endpoint hit");
    const response = `
    <h1 style="text-align:center">Hello</h1>
    <h2 style="text-align:center">Welcome to the Server</h2>
  `;
    res.status(200).send(response);
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info("Root endpoint hit");
    const response = `
    <h1 style="text-align:center">Hello</h1>
    <h2 style="text-align:center">Welcome to the Server</h2>
  `;
    res.status(200).send(response);
}));
app.all("*", notFound_1.default);
app.use(globalErrorHandler_1.default);
app.use((err, req, res, next) => {
    logger_1.logger.error(`Error occurred: ${err.message}`, { stack: err.stack });
    next(err);
});
exports.default = app;
// cron.schedule("0 0 * * *", async () => {
//   try {
//     const today = new Date().toISOString().split("T")[0];
//     await userVisitModel.deleteMany({ date: { $lt: today } });
//     console.log("Old user visit records cleared.");
//   } catch (error) {
//     console.error("Error clearing user visit records:", error);
//   }
// });
