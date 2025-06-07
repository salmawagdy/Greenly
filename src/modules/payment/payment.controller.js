import express from "express";
import { createCheckoutSession ,handleStripeWebhook } from "./services/payment.services.js";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import { endpoint } from "./payment.authorization.js";
const router = express.Router();


router.post(
  "/create-order",
  authentication(),
  authorization(endpoint.paymentt),createCheckoutSession
)

// router.post(
//   "/create-order",
//   authentication(),
//   authorization(endpoint.paymentt),
//   createStripeOrder
// );

 router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);



export default router;
