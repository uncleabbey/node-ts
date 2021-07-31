import express from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import * as dotenv from 'dotenv';
import cors from 'cors';
import debug from 'debug';
import { CommonRouteConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import connectDb from './utils/db';
import { UserDocument } from 'users/user.model';
import { PostDocument } from 'posts/posts.model';
import { CommentDocument } from 'comments/comments.models';

dotenv.config();

connectDb();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserDocument;
      post?: PostDocument;
      comment?: CommentDocument;
    }
  }
}
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 5001;
const routes: Array<CommonRouteConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json());
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true }),
  ),
};

if (process.env.DEBUG) {
  process.on('unhandledRejection', (reason) => {
    debugLog('Unhandled Rejection:', reason);
    process.exit(1);
  });
} else {
  loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new UsersRoutes(app));

app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(`Server up and running!`);
});

server.listen(port, () => {
  debugLog(`Server is running on http://localhost:${port}`);
  routes.forEach((route: CommonRouteConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
});
