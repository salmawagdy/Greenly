import {customAlphabet} from 'nanoid'
import {EventEmitter }from "node:events"
import { generateHash } from '../security/hash.security.js'
import { sendEmail } from '../email/send.email.js'
import { verifyAcc } from '../email/template/verifyAcc.js'
import userModel from '../../DB/model/userModel.js'

//import jwt from 'jsonwebtoken'
//import { generateEmailTemplate,sendEmail } from "../email.js"
export const emailEvent = new EventEmitter()

export const emailSubject ={
    confirmEmail:'Confirm-Email',
    resetPassword:'Reset-Password'
}

export const sendCode = async ({data= {},subject= emailSubject.confirmEmail}={}) =>{
    const {id,email}= data
    const otp = customAlphabet('0123456789',4)();
    const hashOTP= generateHash({plainText:otp})

    let updateData = {}
    switch(subject){
        case emailSubject.confirmEmail:
            updateData = {confirmEmailOTP:hashOTP}
            break;
        case emailSubject.resetPassword:
            updateData = {resetPasswordOTP:hashOTP}
            break;

        default:
            break;
    }
    await userModel.updateOne({_id:id},updateData)
    const html= verifyAcc({code:otp})
    await sendEmail({to:email, subject,html})
}

emailEvent.on('sendEmail',async(data)=>{
    await sendCode({data})
    
})


emailEvent.on('forgetPassword',async(data)=>{
    await sendCode({data,subject:emailSubject.resetPassword})
})