import userModel from "../../../DB/model/userModel.js";
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";
import { compareHash, generateHash } from "../../../utilis/security/hash.security.js";
import { emailEvent } from "../../../utilis/events/email.event.js";

export const signup =asyncHandler(async(req,res,next)=>{
    const {userName,email,password,phone,age}=req.body;
        if(await userModel.findOne({email})){
            return next(new Error ("This email already exists",{cause:409}))
        } 
        const hashPassword = generateHash({plainText:password})
        const user = await userModel.create({userName, email, password:hashPassword,age,phone})


        emailEvent.emit('sendEmail',{id:user._id,email})

        return successResponse({res, message:"Created successfully",status:201})
})

export const confirmEmail = asyncHandler(async(req,res,next)=>{
    const {email, code}=req.body
    const user = await userModel.findOne({email})
    if (!user){
        return next (new Error ("Please verify your account", {cause:404}))

    }
    if (user.confirmEmail){
        return next (new Error ("Your email is already verified", {cause:409}))
        
    }
    if (!compareHash({plainText:code, hashValue:user.confirmEmailOTP})){


        return next (new Error("In-valid OTP", {cause:400}))
    }
        await userModel.updateOne({email},{confirmEmail:true, $unset:{confirmEmailOTP:1}})


        return successResponse({res})

    
})


