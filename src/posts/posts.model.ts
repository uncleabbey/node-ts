import { Schema, model, Document } from 'mongoose';
import { IUser } from 'users/user.model';

export interface IPosts {
  title: string;
  body: string;
  author: IUser;
  createdAt: string;
  modifiedAt: string;
  comments: [];
}

export interface PostDocument extends IPosts, Document {}
const postSchema = new Schema<PostDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true },
);

const Post = model<PostDocument>('Post', postSchema);

export default Post;
