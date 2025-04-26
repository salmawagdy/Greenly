import joi from 'joi'
import { generalFields } from '../../middleware/validation.middleware.js'


export const createPost = joi.object().keys({
    content:joi.string().min(2).max(5000).required()
})

export const updatePost = joi.object().keys({
    content:joi.string().min(2).max(5000).required(),
    postId:joi.required()

})

export const deletePost = joi.object().keys({
    postId:joi.required()

})