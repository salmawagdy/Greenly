import * as licenseServices from './service/license.service.js'
import * as validators from './license.validation.js'
import { validation } from '../../middleware/validation.middleware.js'
import { authentication,authorization } from '../../middleware/auth.middleware.js'
import {endpoint} from './license.authorization.js'
import { uploadLicenseFiles } from '../../utilis/multer/local.multer.js'
import {Router}from "express"
const router = Router();

router.post('/requestLicense',authentication(),authorization(endpoint.request),uploadLicenseFiles,validation(validators.requestLicenseValidation), licenseServices.requestLicense)
router.get('/getAllRequests',authentication(),authorization(endpoint.getRequests),licenseServices.getAllRequests)
router.get('/:userId',authentication(),authorization(endpoint.request),licenseServices.getUserRequests)


export default router