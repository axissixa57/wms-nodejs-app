import express from 'express';
import * as authMiddleware from '../middlewares/auth';
import * as reportsController from '../controllers/reportsController';

const reportsRouter = express.Router();

reportsRouter.get("/remainder", authMiddleware.redirectLogin, reportsController.getRemainderPage);

export { reportsRouter };