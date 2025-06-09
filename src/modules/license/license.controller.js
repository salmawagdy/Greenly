import * as licenseServices from './service/license.service.js'
import * as validators from './license.validation.js'
import { validation } from '../../middleware/validation.middleware.js'
import { authentication,authorization } from '../../middleware/auth.middleware.js'
import {endpoint} from './license.authorization.js'
import { uploadLicenseFiles } from '../../utilis/multer/local.multer.js'
import {Router}from "express"
const router = Router();

router.post('/getByStatus',authentication(),licenseServices.getLicensesByStatus)
router.post('/requestLicense',authentication(),authorization(endpoint.userRequest),uploadLicenseFiles,validation(validators.requestLicenseValidation), licenseServices.requestLicense)
router.get('/getAllRequests',authentication(),authorization(endpoint.adminRequest),licenseServices.getAllRequests)
router.get('/user/:userId',authentication(),licenseServices.getUserRequests)
router.get('/:licenseId',authentication(),licenseServices.getLicenseById)
router.patch('/:licenseId',authentication(),authorization(endpoint.adminRequest),licenseServices.updateLicenseStatus)



export default router