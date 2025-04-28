import { Router } from "express";
import { authentication,authorization } from '../../middleware/auth.middleware.js'
import {endpoint} from './product.authorization.js'
import * as productServices from "./services/product.services.js";
import { uploadProductImages } from '../../utilis/multer/local.multer.js'
const router = Router();

router.get("/products-by-category/:id", productServices.getProductByCategoryId);
router.get("/allproducts",  productServices.getProduct);
router.post("/addproduct",authentication(),authorization(endpoint.addProduct),uploadProductImages, productServices.createProduct);
router.get("/:id", productServices.getProductById);
router.put("/:id",authentication(),authorization(endpoint.addProduct), productServices.updateProduct);

export default router;
