import express from "express";

import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  getUserSubscriptions,
  updateSubscription,
} from "./subscription.controller";
import { authMiddleware } from "../../../middlewares/auth";

const router = express.Router();

router.post("/create", authMiddleware("admin"), createSubscription);
router.get("/", getSubscription);
router.post("/update", authMiddleware("admin"), updateSubscription);
router.post("/delete", authMiddleware("admin"), deleteSubscription);
router.get("/my", authMiddleware("user"), getUserSubscriptions);
// router.post('/restore', authMiddleware("admin"), restorePromoCode);

export const subscriptionRoutes = router;
