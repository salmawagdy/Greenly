import {Router} from 'express'
import * as registration from './services/registration.service.js'
import * as login from './services/login.service.js'
import * as validators from "./auth.validation.js"
import { validation } from '../../middleware/validation.middleware.js';
const router = Router();



router.post('/signup',validation(validators.signup),registration.signup)
router.patch('/confirm-email',validation(validators.confirmEmail),registration.confirmEmail)
router.post('/login',validation(validators.login),login.login)
router.patch('/forgetPassword',validation(validators.forgetPassword),login.forgetPassword)
router.patch('/validateForgetPassword',validation(validators.validateForgetPassword),login.validateForgetPassword)
router.patch('/resetPassword',validation(validators.resetPassword),login.resetPassword)

export default router