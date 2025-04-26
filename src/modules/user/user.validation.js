import joi from 'joi'
import { generalFields } from '../../middleware/validation.middleware.js'

export const updatePassword = joi.object().keys({
    oldPassword:generalFields.password.required(),
    password:generalFields.password.not(joi.ref('old')).required(),
    confirmPassword:generalFields.confirmPassword.required()
})

export const updateProfile=joi.object().keys({
    userName:generalFields.userName,
    phone:generalFields.phone,
    age:joi.string()
})