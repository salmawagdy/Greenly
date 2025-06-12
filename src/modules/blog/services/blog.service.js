import userModel, { roleTypes } from "../../../DB/model/userModel.js";
import blogModel from '../../../DB/model/blog.model.js';
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";
import mongoose from 'mongoose'

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

        return successResponse({ res, data: { post: updatedPost,
            userName:updatedPost.createdBy.userName } });
});


export const deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await blogModel.findById(postId).populate('createdBy', 'userName');
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin = req.user.role === roleTypes.admin;
  const isOwner = post.createdBy._id.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    return res.status(403).json({
      message: "You are not authorized to delete this post",
      data: { post },
    });
  }

  await post.deleteOne(); 

  const blogs = isAdmin
    ? await blogModel.find()
        .populate({ path: 'createdBy', select: 'userName' })
        .populate({ path: 'replies.createdBy', select: 'userName' })
    : await blogModel.find({ createdBy: req.user._id })
        .populate({ path: 'createdBy', select: 'userName' })
        .populate({ path: 'replies.createdBy', select: 'userName' });

  return successResponse({
    res,
    status: 200,
    message: `Post and its replies deleted successfully `,
    data: blogs,
  });
});




export const getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await blogModel.find()
    .populate({ path: 'createdBy', select: 'userName' }) 
    .populate({ path: 'replies.createdBy', select: 'userName' }); 

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

export const replyToPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Reply content is required" });
  }

  const post = await blogModel.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = {
    content,
    createdBy: req.user._id,
  };

  post.replies.push(reply);
  await post.save();

  await post.populate([
    { path: 'createdBy', select: 'userName' },
    { path: 'replies.createdBy', select: 'userName' },
  ]);

  return successResponse({
    res,
    status: 201,
    message: 'Reply added successfully',
    data: post,
  });
});


export const deleteReply = asyncHandler(async (req, res, next) => {
  const { postId, replyId } = req.params;

  const post = await blogModel.findById(postId)
    .populate('createdBy', 'userName')
    .populate('replies.createdBy', 'userName');

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = post.replies.id(replyId);
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const isAdmin = req.user.role === roleTypes.admin;
  const isAuthor = reply.createdBy._id.toString() === req.user._id.toString();

  if (!isAdmin && !isAuthor) {
    return res.status(403).json({ message: "You are not authorized to delete this reply" });
  }

  reply.remove(); // remove the subdocument
  await post.save();

  await post.populate('replies.createdBy', 'userName');

  return successResponse({
    res,
    status: 200,
    message: "Reply deleted successfully",
    data: post,
  });
});
