import jwt from 'jsonwebtoken'
import userModel from '../../DB/model/userModel.js';
import { asyncHandler } from '../response/error.response.js';

export const tokenTypes = {
    access:'access',
    refresh:'refresh'
}

export const decodedToken = async({authorization="" , tokenType=tokenTypes.access , next={}}={})=>{
    const [Bearer,token]=authorization?.split(' ')||[]
    if (!Bearer||!token){
        return next (new Error("Token is missing ", {cause:400}))
    }
    let access_signature='';
    let refresh_signature='';
  
    const decoded = verifyToken({token,signature:process.env.USER_ACCESS_TOKEN});

    if(!decoded?.id){
        return next (new Error('In-valid token payload',{cause:404}))
    }


    const user = await userModel.findById(decoded.id)
    console.log({ user })
    if(!user){
        return next (new Error('not registered account',{cause:404}))
    }
    if(user.changeCredentialTime?.getTime() >=decoded.iat  * 1000){
        return next (new Error('In-valid login credentials',{cause:404}))
    }
    return user
}



export const generateToken = ({payload = {}, signature=process.env.USER_ACCESS_TOKEN, expiresIn = process.env.EXPIRESIN})=>{
    const token = jwt.sign(payload,signature, {expiresIn:parseInt(expiresIn)})
    return token
}


export const verifyToken = ({token, signature=process.env.USER_ACCESS_TOKEN})=>{
    const decoded = jwt.verify(token,signature)
    return decoded
}


