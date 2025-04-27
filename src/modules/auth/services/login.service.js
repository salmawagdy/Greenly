import userModel from "../../../DB/model/userModel.js";
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";
import { compareHash, generateHash } from "../../../utilis/security/hash.security.js";
import { emailEvent } from "../../../utilis/events/email.event.js";
import { confirmEmail } from "./registration.service.js";
import { generateToken } from "../../../utilis/security/token.security.js";
import {roleTypes} from '../../../DB/model/userModel.js'



export const login = asyncHandler(
async (req,res,next)=>{
    const{email, password}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        return next (new Error("Invalid email or password",{cause:404}))
    } 
    if (!user.confirmEmail){
        return next (new Error("Please verify your email",{cause:404}))
    }
    if(!compareHash({plainText:password,hashValue:user.password})){
        return next (new Error("Invalid email or password",{cause:404}))
    }
            
    const accessToken= generateToken({
        payload:{id:user._id},
        signature:user.role === roleTypes.admin ? process.env.ADMIN_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN

    })
    const refreshToken= generateToken({
        payload:{id:user._id},
        signature:user.role === roleTypes.admin ? process.env.ADMIN_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
        expiresIn:31536000

    })

    return successResponse({res,data:{accessToken, refreshToken}})

    })


export const forgetPassword = asyncHandler(async(req,res,next)=>{
    const {email}=req.body;
    const user = await userModel.findOne({email})
    if (!user){
        return next (new Error('In-valid account',{cause:404}))
    }
    if (!user.confirmEmail){
        return next (new Error('Please verify your email first',{cause:404}))
    }

    emailEvent.emit('forgetPassword',{id:user._id,email})
    return successResponse({res})


})

export const validateForgetPassword = asyncHandler(async(req,res,next)=>{
    const {email,code}=req.body;
    const user = await userModel.findOne({email})
    if (!user){
        return next (new Error('In-valid account',{cause:404}))
    }
    if (!user.confirmEmail){
        return next (new Error('Please verify your email first',{cause:404}))
    }

if(!compareHash({plainText: code , hashValue: user.resetPasswordOTP})) {

    return next (new Error("In-valid reset OTP", {cause:400}))
}
    return successResponse({res})
})

export const resetPassword  = asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    const user = await userModel.findOne({email})
    if (!user){
        return next (new Error('In-valid account',{cause:404}))
    }
    if (!user.confirmEmail){
        return next (new Error('Please verify your email first',{cause:404}))
    }

// if(!compareHash({plainText: code , hashValue: user.resetPasswordOTP})) {

//     return next (new Error("In-valid reset OTP", {cause:400}))
// }

await userModel.updateOne({email},{
    password: generateHash({plainText:password}),
    changeCredentialTime:Date.now(),
    $unset:{
        resetPasswordOTP:0
    }
})


    return successResponse({res})
})