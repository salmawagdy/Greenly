
import mongoose, { Schema, Types, model } from 'mongoose';

const replySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 1000,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const blogSchema = new Schema(
  {
    content: {
      type: String,
      minLength: 2,
      maxLength: 5000,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
    deletedBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
    idDeleted: Boolean,
    replies: [replySchema], // <-- Embedding replies
  },
  { timestamps: true }
);

export const blogModel = mongoose.models.blog || model('blog', blogSchema);
export default blogModel;
