"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("./subscription.controller");
const auth_1 = require("../../../middlewares/auth");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)("admin"), subscription_controller_1.createSubscription);
router.get("/", subscription_controller_1.getSubscription);
router.post("/update", (0, auth_1.authMiddleware)("admin"), subscription_controller_1.updateSubscription);
router.post("/delete", (0, auth_1.authMiddleware)("admin"), subscription_controller_1.deleteSubscription);
router.get("/my", (0, auth_1.authMiddleware)("user"), subscription_controller_1.getUserSubscriptions);
// router.post('/restore', authMiddleware("admin"), restorePromoCode);
exports.subscriptionRoutes = router;
