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
exports.updatePrivacy = exports.getAllPrivacy = exports.createPrivacy = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const Privacy_service_1 = require("./Privacy.service");
const user_service_1 = require("../user/user.service");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
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
exports.createPrivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format.");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const userId = decoded.id; // Assuming the token contains the userId
    // Find the user by userId
    const user = yield (0, user_service_1.findUserById)(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    // Check if the user is an admin
    if (user.role !== "admin") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only admins can create terms.");
    }
    const { description } = req.body;
    const sanitizedContent = (0, sanitize_html_1.default)(description, sanitizeOptions);
    if (!description) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Description is required!");
    }
    const result = yield (0, Privacy_service_1.createPrivacyInDB)({ sanitizedContent });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Privacy created successfully.",
        data: result,
    });
}));
exports.getAllPrivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Privacy_service_1.getAllPrivacyFromDB)();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Privacy retrieved successfully.",
        data: result,
    });
}));
exports.updatePrivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No token provided or invalid format.");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
    const userId = decoded.id;
    // Find the user by userId
    const user = yield (0, user_service_1.findUserById)(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    // Check if the user is an admin
    if (user.role !== "admin") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only admins can update privacy.");
    }
    // Sanitize the description field
    const { description } = req.body;
    if (!description) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Description is required.");
    }
    const sanitizedDescription = (0, sanitize_html_1.default)(description, sanitizeOptions);
    // Assume you're updating the terms based on the sanitized description
    const result = yield (0, Privacy_service_1.updatePrivacyInDB)(sanitizedDescription);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update privacy.");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Privacy updated successfully.",
        data: result,
    });
}));
