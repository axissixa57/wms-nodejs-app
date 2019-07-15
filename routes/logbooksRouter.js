import express from 'express';
import * as authMiddleware from '../middlewares/auth';
import * as logbooksController from '../controllers/logbooksController';

const logbooksRouter = express.Router();

logbooksRouter.get("/shipments", authMiddleware.redirectLogin, logbooksController.getLogbookShipmentsPage);
logbooksRouter.get("/movements", authMiddleware.redirectLogin, logbooksController.getLogbookMovementsPage);

export { logbooksRouter };