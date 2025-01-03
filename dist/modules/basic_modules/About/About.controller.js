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
exports.updateAbout = exports.getAllAbout = exports.createAbout = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("../user/user.service");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const About_service_1 = require("./About.service");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const config_1 = require("../../../config");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const sanitizeOptions = {
    allowedTags: [
        "b",
        "i",
        "em",
        "strong",
        "a",
        "p",
        "br",
        "ul",
        "ol",
        "li",
        "blockquote",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "code",
        "pre",
        "img",
    ],
    allowedAttributes: {
        a: ["href", "target"],
        img: ["src", "alt"],
    },
    allowedIframeHostnames: ["www.youtube.com"],
};
exports.createAbout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'No token provided or invalid format.');
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = yield (0, user_service_1.findUserById)(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found.');
    }
    if (user.role !== "admin") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Only admins can create terms.');
    }
    const { description } = req.body;
    const sanitizedContent = (0, sanitize_html_1.default)(description, sanitizeOptions);
    if (!description) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Description is required!');
    }
    const result = yield (0, About_service_1.createAboutInDB)({ sanitizedContent });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "About created successfully.",
        data: result,
    });
}));
exports.getAllAbout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, About_service_1.getAllAboutFromDB)();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "About retrieved successfully.",
        data: result,
    });
}));
exports.updateAbout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'No token provided or invalid format.');
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const userId = decoded.id;
    // Find the user by userId
    const user = yield (0, user_service_1.findUserById)(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found.');
    }
    // Check if the user is an admin
    if (user.role !== "admin") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Only admins can update terms.');
    }
    // Sanitize the description field
    const { description } = req.body;
    if (!description) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Description is required..');
    }
    const sanitizedDescription = (0, sanitize_html_1.default)(description, sanitizeOptions);
    // Assume you're updating the terms based on the sanitized description
    const result = yield (0, About_service_1.updateAboutInDB)(sanitizedDescription);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update terms.');
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "About updated successfully.",
        data: result,
    });
}));
