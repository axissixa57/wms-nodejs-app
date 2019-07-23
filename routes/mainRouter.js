import express from 'express';
import * as authMiddleware from '../middlewares/auth';
import * as mainController from '../controllers/mainController';

const mainRouter = express.Router();

mainRouter.get('/', authMiddleware.redirectLogin, mainController.getMainPage);

export { mainRouter };
