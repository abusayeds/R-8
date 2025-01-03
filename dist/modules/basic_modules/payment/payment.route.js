"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = require("../../../middlewares/auth");
const router = express_1.default.Router();
router.post("/", (0, auth_1.authMiddleware)("user"), payment_controller_1.paymentCreate);
router.get("/history", (0, auth_1.authMiddleware)("admin"), payment_controller_1.getAllPayment);
exports.paymentRoutes = router;
