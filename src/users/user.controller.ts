import { Request, Response } from 'express';
import { compare } from 'bcrypt';
import { pick } from 'lodash';
import errorResponse from '../utils/errorResponse';
import sendMessage from '../utils/sendMessage';
import successResponse from '../utils/successResponse';
import { addUser, checkVerified, findUserByEmail, findUserById, generateVerifyToken } from './user.service';

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    let user = await findUserByEmail(req.body.email);
    if (!user) {
      user = await addUser(req.body);
      const secret = await generateVerifyToken(user._id);
      await sendMessage(user.name, user._id, secret.verifyToken);
      return successResponse({
        res,
        status: 201,
        message: 'User registered successfully, check your mail for verification ',
        data: { user: pick(user, ['isAdmin', 'isVerified', 'name', 'email']) },
      });
    }
    return errorResponse({ res, status: 401, error: 'sorry user already registered' });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

export const verifyUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, token } = req.params;
    const user = await findUserById(userId);
    if (!user) {
      return errorResponse({ res, status: 404, error: 'sorry user does not exist' });
    }
    if (user.isVerified) {
      return errorResponse({ res, status: 400, error: 'User is already verified' });
    }
    const verifyUser = await checkVerified(token, userId);
    if (!verifyUser) {
      return errorResponse({ res, status: 400, error: 'sorry token has expired' });
    }
    return successResponse({ res, status: 200, message: 'user verified successfully' });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};
export const resendVerification = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return errorResponse({ res, status: 404, error: 'sorry user does not exist' });
    }
    if (user.isVerified) {
      return errorResponse({ res, status: 400, error: 'User is already verified' });
    }
    const secret = await generateVerifyToken(user._id);
    await sendMessage(user.name, user._id, secret.verifyToken);

    return successResponse({ res, status: 201, message: 'success, check your mail' });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return errorResponse({ res, status: 401, error: 'invalid email or password' });
    }
    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      return errorResponse({ res, status: 401, error: 'invalid email or password' });
    }

    if (!user.isVerified) {
      return errorResponse({ res, status: 401, error: 'Sorry, You need to verify your account before you can log in' });
    }
    const token = user.generateToken();
    return successResponse({
      res,
      status: 201,
      message: 'Login was successful',
      data: { user: pick(user, ['isAdmin', 'isVerified', 'name', 'email']), token },
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

export const getUser = (req: Request, res: Response): Response => {
  const user = req.user;
  return successResponse({
    res,
    status: 200,
    data: { user: pick(user, ['isAdmin', 'isVerified', 'name', 'email']) },
    message: 'user retrieved successfully',
  });
};
