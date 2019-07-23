import express from 'express';
import * as authMiddleware from '../middlewares/auth';
import * as logController from '../controllers/logController';

const logRouter = express.Router();

logRouter.get('/', authMiddleware.redirectMain, logController.getLoginPage);
logRouter.post(
  '/',
  authMiddleware.redirectMain,
  logController.postDataFromLoginPage
);

logRouter.get(
  '/logout',
  authMiddleware.redirectLogin,
  logController.exitFromApp
);

export { logRouter };
