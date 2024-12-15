import express from "express";

import { getAllPayment, paymentCreate } from "./payment.controller";
import { authMiddleware } from "../../../middlewares/auth";

const router = express.Router();

router.post("/", authMiddleware("user"), paymentCreate);
router.get("/history", authMiddleware("admin"), getAllPayment);

export const paymentRoutes = router;
