import { User, IUser, UserDocument, Secret, SecretDocument } from './user.model';
import { genSalt, hash } from 'bcrypt';

export const findUserByEmail = async (email: string): Promise<UserDocument | null> => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    return error;
  }
};
export const findUserById = async (id: string): Promise<UserDocument | null> => {
  try {
    return await User.findById(id);
  } catch (error) {
    return error;
  }
};

export const addUser = async (user: IUser): Promise<UserDocument> => {
  try {
    const newUser = new User(user);

    const salt = await genSalt(10);
    const password = await hash(newUser.password, salt);
    newUser.password = password;

    await newUser.save();

    return newUser;
  } catch (error) {
    return error;
  }
};

export const generateVerifyToken = async (user: string): Promise<SecretDocument> => {
  const token = (+new Date()).toString(36).slice(-10) + Math.random().toString(36).slice(-5);
  try {
    const secret = new Secret({
      user,
      verifyToken: token,
    });
    await secret.save();
    return secret;
  } catch (error) {
    return error;
  }
};
export const checkVerified = async (token: string, userId: string): Promise<boolean> => {
  try {
    const secret = await Secret.findOne({ verifyToken: token, user: userId });
    if (!secret) {
      return false;
    }
    await User.findByIdAndUpdate(userId, { isVerified: true });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
