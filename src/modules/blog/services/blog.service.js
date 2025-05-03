import userModel, { roleTypes } from "../../../DB/model/userModel.js";
import blogModel from '../../../DB/model/blog.model.js';
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";

export const createPost =asyncHandler(
    async(req,res,next)=>{
        const {content}=req.body
        const post = await blogModel.create({content,createdBy:req.user._id})
        await post.populate('createdBy', 'userName');
        return successResponse({res, status:201,data:{post,userName:post.createdBy.userName}})
    }

)


export const updatePost = asyncHandler(async (req, res, next) => {
    const  postId = req.params.postId; 
    const { content } = req.body; 

    const post = await blogModel.findById(postId);
    if (!post) {
return res.status(404).json({ message: "Post not found" });
    }

    if (post.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not authorized to update this post" });
    }

    const updatedPost = await blogModel.findByIdAndUpdate(
    postId, { content }, { new: true } ).populate('createdBy', 'userName');

        return successResponse({ res, data: { post: updatedPost,userName:updatedPost.createdBy.userName } });
});


export const deletePost = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;

    const post = await blogModel.findById(postId);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const isAdmin = req.user.role === roleTypes.admin;
    const isOwner = post.createdBy.toString() === req.user._id.toString();

    if (isAdmin || isOwner) {
        await post.deleteOne();

        // Fetch blogs according to role
        const blogs = isAdmin
            ? await blogModel.find()
            : await blogModel.find({ createdBy: req.user._id });

        return successResponse({
            res,
            status: 200,
            message: "Post deleted successfully",
            data: blogs,
        });
    } else {
        return res.status(403).json({ 
            message: "You are not authorized to delete this post",
            data: { post }
        });
    }
});




export const getAllPosts = asyncHandler(async (req, res, next) => {
    const posts = await blogModel.find().populate('createdBy','userName');
    return successResponse({
    res,
    status: 200,
    data: posts,
    });
});


export const getUserPosts = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const posts = await blogModel.find({ createdBy: userId })
    .populate('createdBy','userName');

    return successResponse({
    res,
    status: 200,
    data: posts,
    });
});