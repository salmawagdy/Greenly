import { Router } from "express";
import { authentication,authorization } from '../../middleware/auth.middleware.js'
import {endpoint} from './subCategories.authorization.js'
import * as subCategoryServices from "./services/subCategories.services.js";
const router = Router();

router.get("/allsubcategories", subCategoryServices.getSubCategory);
router.get("/:id", subCategoryServices.getSubCategoryById);
router.post("/addsubCategory",authentication(),authorization(endpoint.addSub),subCategoryServices.createSubCategory);
router.delete("/delete/:id",authentication(),authorization(endpoint.addSub),subCategoryServices.deleteSubCategory);

export default router;
