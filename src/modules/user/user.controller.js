import {Router} from 'express'
import  {userProfile, updatePassword,updateProfile,updateProfileImage}from './services/user.service.js'
import { authentication, authorization } from '../../middleware/auth.middleware.js'
import { validation } from '../../middleware/validation.middleware.js';
import * as validators from './user.validation.js'
import { uploadFileDisk } from '../../utilis/multer/local.multer.js';

const router = Router();

router.get('/userProfile',authentication(),userProfile)
router.patch('/updateProfile', validation(validators.updateProfile),authentication(),updateProfile)
router.patch('/updatePassword', validation(validators.updatePassword),authentication(),updatePassword)
router.patch('/updateProfileImage',
authentication(),uploadFileDisk('user/profile').array('image')
,updateProfileImage)



export default router