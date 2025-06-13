import express from "express";
import {
  createCheckoutSession,
  //handleStripeWebhook,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} from "./services/payment.services.js";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import { endpoint } from "./payment.authorization.js";
const router = express.Router();

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   handleStripeWebhook
// );

router.post(
  "/create-order",
  authentication(),
  authorization(endpoint.paymentt),
  createCheckoutSession
);

router.get(
  "/allorders",
  authentication(),
  authorization(endpoint.adminn),
  getAllOrders
);
router.get(
  "/:id",
  authentication(),
  authorization(endpoint.paymentt),
  getSingleOrder
);
router.patch(
  "/update-status/:orderId",
  authentication(),
  authorization(endpoint.adminn),
  updateOrderStatus
);

export default router;

// router.post(
//   "/create-order",
//   authentication(),
//   authorization(endpoint.paymentt),
//   createStripeOrder
// );
