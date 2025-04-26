import mongoose ,{model, Schema } from "mongoose";

export const roleTypes = {
    user:'user',
    admin:"admin",
}

const userSchema = new Schema ({
    userName:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50,
        trim:true

    },
    email:{
        type:String,
        unique:true,
        required:true
        
    },
    confirmEmailOTP:String,

    password:{
        type:String,
        required:true
    },
    resetPasswordOTP:String,
    phone:String,
    age:String,
    
    confirmEmail:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:Object.values(roleTypes),
        default:roleTypes.user
    },
    changeCredentialTime:Date,
    image: {
        type: [String], 
        default: []
    }
    
},{timestamps:true})


const userModel =mongoose.models.User || model('user', userSchema)
export default userModel