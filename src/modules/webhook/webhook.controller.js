import express from "express";
import { handleStripeWebhook } from "./services/webhook.services.js";

const router = express.Router();

// Endpoint for Stripe webhook
router.post("/webhook", handleStripeWebhook);

export default router;
