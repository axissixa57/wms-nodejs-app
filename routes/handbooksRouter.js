import express from 'express';
import * as authMiddleware from '../middlewares/auth';
import * as handbooksConroller from '../controllers/handbooksConroller';

const handbooksRouter = express.Router();

handbooksRouter.get("/contractors", authMiddleware.redirectLogin, handbooksConroller.getContractorsPage);
handbooksRouter.get("/goods", authMiddleware.redirectLogin, handbooksConroller.getGoodsPage);
handbooksRouter.get("/warehouses", authMiddleware.redirectLogin, handbooksConroller.getWarehousesPage);

export { handbooksRouter };