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
exports.studioController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const studio_service_1 = require("./studio-service");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const adminModel_1 = require("../admin/adminModel");
const createStudio = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield studio_service_1.studioService.createStudioDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Studio created successfully !",
        data: result,
    });
    if (result.isApprove === false) {
        yield adminModel_1.adminStudioApproveModel.create({
            studioId: result._id
        });
    }
}));
const getSingleStudio = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studioId } = req.params;
    const result = yield studio_service_1.studioService.getSingleStudioDB(studioId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: " Get Studio  successfully !",
        data: result,
    });
}));
const getStudioReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studioId } = req.params;
    const result = yield studio_service_1.studioService.getStudioReviewsDB(studioId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: " Get Studio reviews  successfully !",
        data: result,
    });
}));
const getStudios = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield studio_service_1.studioService.getStudiosDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: " Get Studio  successfully !",
        data: result,
    });
}));
exports.studioController = {
    createStudio,
    getSingleStudio,
    getStudioReviews,
    getStudios
};
