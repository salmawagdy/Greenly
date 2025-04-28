import { Router } from "express";
import * as cartServices from "./services/cart.services.js";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import { endpoint } from "./cart.authorization.js";
const router = Router();

router.post(
  "/addtocart",
  authentication(),
  authorization(endpoint.addToCart),
  cartServices.addToCart
);
router.get("/getcart", authentication(),authorization(endpoint.addToCart), cartServices.getCart);
router.put(
  "/updatecart",
  authentication(),
  authorization(endpoint.addToCart),
  cartServices.updateCart
);
router.delete(
  "/:productId",
  authentication(),
  authorization(endpoint.addToCart),
  cartServices.deleteCart
);
router.delete(
  "/clearcart", authentication(),
  authorization(endpoint.addToCart),
  cartServices.clearCart
);

export default router;
