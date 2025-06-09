import Router from 'express';

import { checkLoan } from "./services/loan.services.js";
import { authentication, authorization } from '../../middleware/auth.middleware.js'
import { endpoint } from './loan.authorization.js'

const router = Router();

router.post('/check-loan', authentication(),authorization(endpoint.loan), checkLoan);

export default router;