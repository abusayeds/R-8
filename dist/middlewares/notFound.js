"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const notFound = (req, res) => {
    throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Route Not Found for ${req.originalUrl}`);
};
exports.default = notFound;
