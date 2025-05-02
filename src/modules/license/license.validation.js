import Joi from 'joi'
import { generalFields } from '../../middleware/validation.middleware.js'

export const requestLicenseValidation = Joi.object({
  fullName: Joi.string().required(),
  phoneNumber: generalFields.phone.required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  experience: Joi.required(),
  requiredArea: Joi.required(),
  requiredLocation: Joi.string().required(),
  plantsType: Joi.string().required(),
  numberOfColonies: Joi.required(),
  workPlan: Joi.string().required(),
})
