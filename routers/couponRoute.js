// routes/couponRoutes.js
import express from "express";
import customJwtAuth from "../config/middleware/authentication.js";
import requireRoles from "../config/middleware/requireRole.js";
import { addCoupon, couponApply } from "../controllers/couponConttroler.js";
const router = express.Router();

// POST /api/coupons
router.post("/addcoupon/:id",customJwtAuth,requireRoles(['admin']),addCoupon)
// POST /api/coupons/apply
router.post("/coupons/apply",couponApply);


export default router;
