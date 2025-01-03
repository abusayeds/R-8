"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutRoutes = void 0;
const express_1 = __importDefault(require("express"));
const About_controller_1 = require("./About.controller");
const auth_1 = require("../../../middlewares/auth");
const role_1 = require("../../../utils/role");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.authMiddleware)(role_1.role.admin), About_controller_1.createAbout);
router.get("/", About_controller_1.getAllAbout);
router.post("/update", About_controller_1.updateAbout);
exports.AboutRoutes = router;
