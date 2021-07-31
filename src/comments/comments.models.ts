import { Schema, model, Document } from 'mongoose';
import { PostDocument } from 'posts/posts.model';
import { UserDocument } from 'users/user.model';

export interface IComment {
  post: PostDocument;
  user: UserDocument;
  body: string;
}

export interface CommentDocument extends IComment, Document {}
const commentSchema = new Schema<CommentDocument>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    modifiedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

const Comment = model<CommentDocument>('Comment', commentSchema);

export default Comment;
