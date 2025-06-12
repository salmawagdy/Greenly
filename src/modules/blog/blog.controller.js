import * as blog from './services/blog.service.js'
import * as validators from './blog.validation.js'
import { validation } from '../../middleware/validation.middleware.js'
import { authentication,authorization } from '../../middleware/auth.middleware.js'
import {endpoint} from './blog.authorization.js'
import {Router}from "express"
const router = Router();

router.post('/createPost', authentication(),authorization(endpoint.createPost),validation(validators.createPost),blog.createPost)
router.get('/getAllPosts',blog.getAllPosts)
router.post('/reply/:postId', authentication(),blog.replyToPost);
router.get('/:userId',authentication(),authorization(endpoint.createPost),blog.getUserPosts)

router.delete('/deleteReply/:postId/:replyId', authentication(), blog.deleteReply);


router.patch('/:postId', authentication(),authorization(endpoint.createPost),validation(validators.updatePost),blog.updatePost)
router.delete('/:postId', authentication(),authorization(endpoint.deletePost),validation(validators.deletePost),blog.deletePost)



export default router