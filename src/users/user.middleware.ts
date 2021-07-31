import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import errorResponse from '../utils/errorResponse';
import { IUser } from './user.model';
import { verify } from 'jsonwebtoken';
import constant from '../utils/config';
import { findUserById } from './user.service';
import Post from '../posts/posts.model';
import Comment from '../comments/comments.models';

const validateUserSchema = (user: IUser) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(user);
};

const validateLoginSchema = (user: IUser) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(user);
};

export const validateUserBody = (req: Request, res: Response, next: NextFunction): Response | void => {
  const error = validateUserSchema(req.body);
  if (error.error) {
    return errorResponse({
      res,
      status: 400,
      error: error.error.details[0].message,
    });
  }
  return next();
};
export const validateLoginBody = (req: Request, res: Response, next: NextFunction): Response | void => {
  const error = validateLoginSchema(req.body);
  if (error.error) {
    return errorResponse({
      res,
      status: 400,
      error: error.error.details[0].message,
    });
  }
  return next();
};

const stripBearerToken = (token: string) => {
  let stripedToken = token;
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    const [, jwtToken] = token.split(' ');
    stripedToken = jwtToken;
  }
  return stripedToken;
};

export const isUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const token = req.header('Authorization');
  if (!token) {
    return errorResponse({
      res,
      status: 401,
      error: 'Access Denied: No token provided...',
    });
  }
  type TDecoded = {
    id: string;
  };
  try {
    const strippedToken = stripBearerToken(token);
    const decoded = verify(strippedToken, constant.SECRETNAME as string) as TDecoded;
    const user = await findUserById(decoded.id);
    if (user) {
      req.user = user;
      return next();
    }
    return errorResponse({
      res,
      status: 404,
      error: 'Sorry User not Found',
    });
  } catch (error) {
    // console.log(error)
    return errorResponse({
      res,
      status: 400,
      error: 'Invalid token....',
    });
  }
};

export const isOwner = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { id } = req.params;
  try {
    const post = await Post.findById({ _id: id });
    if (post) {
      if (String(post.author) === String(req.user?._id)) {
        req.post = post;
        return next();
      }
      return errorResponse({
        res,
        status: 401,
        error: 'Sorry on the owner can perform operation',
      });
    }
    return errorResponse({
      res,
      status: 404,
      error: 'post not found',
    });
  } catch (error) {
    return errorResponse({
      res,
      status: 400,
      error,
    });
  }
};

export default async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { commendtId } = req.params;
  try {
    const comment = await Comment.findById({ _id: commendtId });
    if (comment) {
      if (String(comment.user) === String(req.user?._id)) {
        req.comment = comment;
        return next();
      }
      return next({
        status: 401,
        error: 'Sorry on the owner can delete comment',
      });
    }
    return res.status(404).json({
      status: 'error',
      error: 'comment not found',
    });
  } catch (error) {
    return next({
      status: 400,
      error,
    });
  }
};
