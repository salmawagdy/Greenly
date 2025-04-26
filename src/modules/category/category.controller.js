import * as categoryServices from "./services/category.services.js";
import { Router } from "express";
import { authentication,authorization } from '../../middleware/auth.middleware.js'
import {endpoint} from './category.authorization.js'

const router = Router();

router.get("/allcategories", categoryServices.getCategory);
router.get("/:id", categoryServices.getCategoryById);
router.post("/addcategory", authentication(),authorization(endpoint.addCategory), categoryServices.createCategory);

export default router;
