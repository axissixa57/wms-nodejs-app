import express from 'express';
import * as authMiddleware from '../middlewares/auth';
import * as docsController from '../controllers/docsController';

const docsRouter = express.Router();

docsRouter.get("/ttn", authMiddleware.redirectLogin, docsController.getTtnPage);
docsRouter.get("/shipment", authMiddleware.redirectLogin, docsController.getShipmentPage);

export { docsRouter };