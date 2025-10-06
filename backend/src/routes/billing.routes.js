import express from "express";
import {
  createSubscription,
  createOrder,
  captureOrder,
  paypalWebhook,
  getPlans,
  cancelSubscription,
  getUsage,
} from "../controllers/billing.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas públicas
router.get("/plans", getPlans);

// Webhook de PayPal (NO proteger)
router.post("/webhook", paypalWebhook);

// Rutas protegidas
router.use(protect);

router.post("/create-subscription", createSubscription);
router.post("/create-order", createOrder);
router.post("/capture-order", captureOrder);
router.post("/cancel-subscription", cancelSubscription);
router.get("/usage", getUsage);

export default router;
