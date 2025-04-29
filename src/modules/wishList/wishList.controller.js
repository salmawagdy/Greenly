import express from "express";
import * as wishlistServices from "./services/wishList.services.js";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import { endpoint } from "./wishList.authorization.js";

const router = express.Router();
router.post(
  "/addtowishlist",
  authentication(),
  authorization(endpoint.favPage),
  wishlistServices.addToWishlist
);
router.get(
  "/getwishlist",
  authentication(),
  authorization(endpoint.favPage),
  wishlistServices.getWishlist
);
router.delete(
  "/:productId",
  authentication(),
  authorization(endpoint.favPage),
  wishlistServices.removeFromWishlist
);

export default router;
