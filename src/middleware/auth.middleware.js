import { asyncHandler } from "../utilis/response/error.response.js";
import { verifyToken } from "../utilis/security/token.security.js";
import { decodedToken } from "../utilis/security/token.security.js";


export const authentication = ()=>{
    return asyncHandler(async (req,res,next)=>{ 
    
        const {authorization}=req.headers;
        req.user = await decodedToken({authorization, next})
        
    return next()
})
}


export const authorization = (accessRoles=[])=>{
    return asyncHandler(async (req,res,next)=>{ 
    if (!accessRoles.includes(req.user.role)){
        return next (new Error ('not authorized account',{cause:403}))
    }
        
    return next()
})
}



