import { Schema, model, Document, SchemaTypes } from 'mongoose';
import jwt from 'jsonwebtoken';
import constant from '../utils/config';

export interface IUser {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isVerified: boolean;
}
export interface UserDocument extends IUser, Document {
  generateToken(): string;
}
const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateToken = function (this: UserDocument) {
  const token: string = jwt.sign(
    {
      id: this._id,
      name: this.name,
      isAdmin: this.isAdmin,
    },
    constant.SECRETNAME as string,
    {
      expiresIn: '24h',
    },
  );
  return token;
};
const User = model<UserDocument>('User', userSchema);

interface ISecret {
  user: string;
  verifyToken: string;
  dateCreated: string;
}

export interface SecretDocument extends ISecret, Document {}
const secretSchema = new Schema<SecretDocument>({
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
  },
  verifyToken: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
    expires: 600,
  },
});

const Secret = model<SecretDocument>('Secret', secretSchema);
export { User, Secret };
