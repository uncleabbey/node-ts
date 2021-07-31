import { CommonRouteConfig } from '../common/common.routes.config';
import express from 'express';
import { getUser, loginUser, registerUser, resendVerification, verifyUser } from './user.controller';
import { isUser, validateLoginBody, validateUserBody } from './user.middleware';

export class UsersRoutes extends CommonRouteConfig {
  constructor(app: express.Application) {
    super(app, 'UsersRoutes');
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  configureRoutes() {
    this.app.post('/api/v1/auth/register', validateUserBody, registerUser);
    this.app.get('/api/v1/auth/verify/:userId/:token', verifyUser);
    this.app.get('/api/v1/auth/resend/verification', resendVerification);
    this.app.post('/api/v1/auth/login', validateLoginBody, loginUser);
    this.app.get('/api/v1/auth/me', isUser, getUser);
    return this.app;
  }
}
