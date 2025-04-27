import joi from 'joi'

export const generalFields={
userName:joi.string().trim(),
email:joi.string().email(),
password: joi.string().pattern(new RegExp( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
confirmPassword:joi.string().valid(joi.ref('password')).required(),
code:joi.string().pattern(new RegExp(/^\d{4}$/)),
phone:joi.string().pattern(new RegExp(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/
))
}


export const validation = (schema)=>{
    return (req,res,next)=>{
        const inputs = {...req.query,...req.body,...req.params};
        const validationResult = schema.validate(inputs,{abortEarly:false})
        if(validationResult.error){
            return res.status(400).json({message:'validation error',details:validationResult.error.details})

        }
        return next()
    }
    }