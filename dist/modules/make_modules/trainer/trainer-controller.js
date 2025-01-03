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
exports.trainerController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const trainer_service_1 = require("./trainer-service");
const adminModel_1 = require("../admin/adminModel");
const createTrainer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trainer_service_1.trainerService.createTrainerDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: " Trainer created successfully !",
        data: result,
    });
    if (result.isApprove === false) {
        yield adminModel_1.admintrainerApproveModel.create({
            trainerId: result._id
        });
    }
}));
const getTrainer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trainerId } = req.params;
    const result = yield trainer_service_1.trainerService.getTrainerDB(trainerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: " Trainer received successfully !",
        data: result,
    });
}));
const getTrainers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trainer_service_1.trainerService.getTrainersDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: " Get All Trainer  successfully !",
        data: result,
    });
}));
const getSimilarTrainers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trainerType } = req.params;
    const result = yield trainer_service_1.trainerService.similartainerDB(trainerType);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: " Get similar Trainer  successfully !",
        data: result,
    });
}));
exports.trainerController = {
    createTrainer,
    getTrainer,
    getTrainers,
    getSimilarTrainers
};
