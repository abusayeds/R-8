"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.admintrainerApproveModel = exports.adminStudioApproveModel = exports.userVisitModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const studioApproveSchema = new mongoose_1.Schema({
    studioId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Studio",
    },
    action: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});
const trainerApproveSchema = new mongoose_1.Schema({
    trainerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Trainer",
    },
    action: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});
const userVisitSchema = new mongoose_1.Schema({
    count: {
        type: Number,
        default: 0,
    },
    uniqueVisitors: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
exports.userVisitModel = mongoose_1.default.model("UserVisit", userVisitSchema);
exports.adminStudioApproveModel = mongoose_1.default.model("adminStudioApprove", studioApproveSchema);
exports.admintrainerApproveModel = mongoose_1.default.model("adminTrainerApprove", trainerApproveSchema);
