import { Router } from "express";
import * as addressServices from "./services/address.services.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { endpoint } from "./address.authorization.js";

const router = Router();

router.post(
    "/addaddress",
    authentication(),
    authorization(endpoint.addAddress),
    addressServices.addAddress
);
router.get(
    "/getalladdress",
    authentication(),
    addressServices.getAddresses
);
router.patch(
    "/updateaddress/:addressId",
    authentication(),
    authorization(endpoint.addAddress),
    addressServices.setDefaultAddress
);
router.get(
    "/default/:addressId",
    authentication(),
    addressServices.getDefaultAddress
);

router.delete(
    "/deleteaddress/:id",    
    authentication(),
    authorization(endpoint.deleteAddress),
    addressServices.deleteAddress
);

export default router;