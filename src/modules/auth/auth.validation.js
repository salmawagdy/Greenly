import joi from 'joi'
import { generalFields } from '../../middleware/validation.middleware.js'


export const signup = joi.object().keys({
    userName:generalFields.userName.required(),
    email:generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword:generalFields.confirmPassword.required(),
    phone:generalFields.phone,
    age:joi.string()
}).required()


export const confirmEmail = joi.object().keys({
    email:generalFields.email.required(),
    code:generalFields.code.required()
}).required()

export const login = joi.object().keys({
    email:generalFields.email.required(),
    password: generalFields.password.required(),
}).required()


export const forgetPassword = joi.object().keys({
    email:generalFields.email.required(),
}).required()


export const resetPassword = joi.object().keys({
    email:generalFields.email.required(),
    code:generalFields.code.required(),
    password: generalFields.password.required(),
    confirmPassword:generalFields.confirmPassword.required(),
}).required()



export const validateForgetPassword = confirmEmail
