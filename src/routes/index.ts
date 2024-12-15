import express from "express";
import { UserRoutes } from "../modules/basic_modules/user/user.route";
import { TermsRoutes } from "../modules/basic_modules/Terms/Terms.route";
import { AboutRoutes } from "../modules/basic_modules/About/About.route";
import { PrivacyRoutes } from "../modules/basic_modules/privacy/Privacy.route";
import { promoCodeRoutes } from "../modules/basic_modules/promoCode/promoCode.route";
import { feedBackRoutes } from "../modules/basic_modules/Feedback/feedback.route";
import { NotificationRoutes } from "../modules/basic_modules/notifications/notification.route";
import { subscriptionRoutes } from "../modules/basic_modules/subscription/subscription.route";
import { paymentRoutes } from "../modules/basic_modules/payment/payment.route";
import { studioRouts } from "../modules/make_modules/studio/studio-route";
import { studioReviewRouts } from "../modules/make_modules/studioReview/studioReview.route";
import { trainerRouts } from "../modules/make_modules/trainer/trainer-route";
import { trainerReviewRouts } from "../modules/make_modules/trainerReview/trainerReview.route";
import { adminRouts } from "../modules/make_modules/admin/admin.route";


const router = express.Router();
// *** basic route *** //
router.use("/api/v1/user", UserRoutes);
router.use("/api/v1/terms", TermsRoutes);
router.use("/api/v1/about", AboutRoutes);
router.use("/api/v1/privacy", PrivacyRoutes);
router.use("/api/v1/notification", NotificationRoutes);
router.use("/api/v1/cupon-code", promoCodeRoutes);
router.use("/api/v1/feedback", feedBackRoutes);
router.use("/api/v1/subscription", subscriptionRoutes);
router.use("/api/v1/purchase", paymentRoutes);

// *** makes route *** //

// ***  studio route *** //
router.use("/api/v1/studio", studioRouts);
router.use("/api/v1/studio-review", studioReviewRouts);

// ***trainer route *** //
router.use("/api/v1/trainer", trainerRouts);
router.use("/api/v1/trainer-review", trainerReviewRouts);

// ***admin route *** //
router.use("/api/v1/admin", adminRouts);

// *** makes route *** //

export default router;
