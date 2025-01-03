"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/basic_modules/user/user.route");
const Terms_route_1 = require("../modules/basic_modules/Terms/Terms.route");
const About_route_1 = require("../modules/basic_modules/About/About.route");
const Privacy_route_1 = require("../modules/basic_modules/privacy/Privacy.route");
const promoCode_route_1 = require("../modules/basic_modules/promoCode/promoCode.route");
const feedback_route_1 = require("../modules/basic_modules/Feedback/feedback.route");
const notification_route_1 = require("../modules/basic_modules/notifications/notification.route");
const subscription_route_1 = require("../modules/basic_modules/subscription/subscription.route");
const payment_route_1 = require("../modules/basic_modules/payment/payment.route");
const studio_route_1 = require("../modules/make_modules/studio/studio-route");
const studioReview_route_1 = require("../modules/make_modules/studioReview/studioReview.route");
const trainer_route_1 = require("../modules/make_modules/trainer/trainer-route");
const trainerReview_route_1 = require("../modules/make_modules/trainerReview/trainerReview.route");
const admin_route_1 = require("../modules/make_modules/admin/admin.route");
const repost_route_1 = require("../modules/make_modules/report/repost.route");
const route_1 = require("../modules/make_modules/trainer/saveTrainer/route");
const router = express_1.default.Router();
// *** basic route *** //
router.use("/api/v1/user", user_route_1.UserRoutes);
router.use("/api/v1/terms", Terms_route_1.TermsRoutes);
router.use("/api/v1/about", About_route_1.AboutRoutes);
router.use("/api/v1/privacy", Privacy_route_1.PrivacyRoutes);
router.use("/api/v1/notification", notification_route_1.NotificationRoutes);
router.use("/api/v1/cupon-code", promoCode_route_1.promoCodeRoutes);
router.use("/api/v1/feedback", feedback_route_1.feedBackRoutes);
router.use("/api/v1/subscription", subscription_route_1.subscriptionRoutes);
router.use("/api/v1/purchase", payment_route_1.paymentRoutes);
// *** makes route *** //
// ***  studio route *** //
router.use("/api/v1/studio", studio_route_1.studioRouts);
router.use("/api/v1/studio-review", studioReview_route_1.studioReviewRouts);
// ***trainer route *** //
router.use("/api/v1/trainer", trainer_route_1.trainerRouts);
router.use("/api/v1/trainer-review", trainerReview_route_1.trainerReviewRouts);
// ***admin route *** //
router.use("/api/v1/admin", admin_route_1.adminRouts);
// *** repport route *** //
router.use("/api/v1/report", repost_route_1.reportRouts);
// *** save trainer route *** //
router.use("/api/v1/saveTrainer", route_1.savedtrainerRouts);
// *** makes route *** //
exports.default = router;
