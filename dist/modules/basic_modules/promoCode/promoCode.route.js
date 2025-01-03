"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoCodeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const promoCode_controller_1 = require("./promoCode.controller");
const auth_1 = require("../../../middlewares/auth");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)("admin"), promoCode_controller_1.createPromoCode);
router.get("/", (0, auth_1.authMiddleware)("admin"), promoCode_controller_1.getPromoCode);
router.post("/update", (0, auth_1.authMiddleware)("admin"), promoCode_controller_1.updatePromoCode);
router.post("/delete", (0, auth_1.authMiddleware)("admin"), promoCode_controller_1.deletePromoCode);
router.post("/restore", (0, auth_1.authMiddleware)("admin"), promoCode_controller_1.restorePromoCode);
router.post("/use-cupon", (0, auth_1.authMiddleware)("user"), promoCode_controller_1.usePromoCode);
exports.promoCodeRoutes = router;
