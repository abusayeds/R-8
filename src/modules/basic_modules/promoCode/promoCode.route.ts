import express from "express";

import {
  createPromoCode,
  deletePromoCode,
  getPromoCode,
  restorePromoCode,
  updatePromoCode,
  usePromoCode,
} from "./promoCode.controller";
import { authMiddleware } from "../../../middlewares/auth";

const router = express.Router();

router.post("/create", authMiddleware("admin"), createPromoCode);
router.get("/", authMiddleware("admin"), getPromoCode);
router.post("/update", authMiddleware("admin"), updatePromoCode);
router.post("/delete", authMiddleware("admin"), deletePromoCode);
router.post("/restore", authMiddleware("admin"), restorePromoCode);
router.post("/use-cupon", authMiddleware("user"), usePromoCode);

export const promoCodeRoutes = router;
