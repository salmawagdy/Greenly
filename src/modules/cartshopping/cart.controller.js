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
router.get(
  "/getcart",
  authentication(),
  authorization(endpoint.addToCart),
  cartServices.getCart
);
router.put(
  "/updatecart",
  authentication(),
  authorization(endpoint.addToCart),
  cartServices.updateCart
);
router.delete(
  "/clearCart",
  authentication(),
  authorization(endpoint.clearcart),
  cartServices.clearCart
);

router.delete(
  "/:productId",
  authentication(),
  authorization(endpoint.removecart),
  cartServices.deleteCart
);

export default router;
