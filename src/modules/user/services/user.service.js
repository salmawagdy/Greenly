import userModel from '../../../DB/model/userModel.js'
import { asyncHandler } from '../../../utilis/response/error.response.js';
import { successResponse } from '../../../utilis/response/success.response.js';
import { compareHash, generateHash } from '../../../utilis/security/hash.security.js';




export const userProfile = asyncHandler(async(req,res,next)=>{
    return successResponse({res, data:{userID:req.user._id,username:req.user.userName,phone:req.user.phone,age:req.user.age,}})
})

export const updateProfile = asyncHandler(
    async(req,res,next)=>{
    const user = await userModel.findByIdAndUpdate
    (req.user._id, req.body, {new: true, runValidators: true})
    return successResponse({res, data:{user}})
}
)

export const updatePassword = asyncHandler(
    async(req,res,next)=>{
        const {oldPassword, password}=req.body
        if(!compareHash({plainText:oldPassword, hashValue:req.user.password})){
        return next (new Error('The old password is invalid',{cause:400}))
        }
        const user = await userModel.findByIdAndUpdate
        (req.user._id,{password:generateHash({plainText:password})
        ,changeCredentialTime:Date.now()},{new:true})
        
    return successResponse({res,data: {}})
}
)


export const updateProfileImage = asyncHandler(
    async(req,res,next)=>{

        if (!req.files) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
    const user = await userModel.findByIdAndUpdate(req.user._id,{image:req.files.map(file=>file.finalPath)},{new:true, runValidators:true})
    return successResponse({res, data:{user}})
}
)