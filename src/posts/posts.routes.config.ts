import { CommonRouteConfig } from '../common/common.routes.config';
import express from 'express';

export class UsersRoutes extends CommonRouteConfig {
  constructor(app: express.Application) {
    super(app, 'PostRoutes');
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  configureRoutes() {
    return this.app;
  }
}
