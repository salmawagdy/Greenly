import { Router } from "express";
import { createOrder } from "./services";
import { endpoint } from "./order.authorization.js";
import { authentication, authorization } from "../../middlewares/authentication.js";


const router = Router();


router.post("/create-order", authentication(),authorization(endpoint.payment), createOrder);

export default router;