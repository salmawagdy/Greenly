import Joi from 'joi'
import { generalFields } from '../../middleware/validation.middleware.js'

export const requestLicenseValidation = Joi.object({
  fullName: Joi.string().required(),
  phoneNumber: generalFields.phone.required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  experience: Joi.string().required(),
  requiredArea: Joi.string().required(),
  requiredLocation: Joi.string().required(),
  plantsType: Joi.string().required(),
  numberOfColonies: Joi.string().required(),
  workPlan: Joi.string().required(),
})
