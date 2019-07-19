import express from 'express';
// import * as authMiddleware from '../middlewares/auth';
import * as apiController from '../controllers/apiController';

const apiRouter = express.Router();

apiRouter.get("/products", apiController.getProducts);
apiRouter.get("/products/cosmetics", apiController.getCosmeticProducts);
apiRouter.get("/products/meat", apiController.getMeatProducts);
apiRouter.get("/products/marine", apiController.getMarineProducts);
apiRouter.get("/products/:id", apiController.getProductById);
apiRouter.post("/products", apiController.createProduct);
apiRouter.delete("/products/:id", apiController.deleteProduct);
apiRouter.put("/products", apiController.editProduct);

apiRouter.get("/shipment/:id/products", apiController.getProductsFromShipment);
apiRouter.put("/shipment", apiController.updateShipmentStatus);
apiRouter.get("/shipments/:id", apiController.getShipmentById);
apiRouter.get("/shipments", apiController.getShipments);
apiRouter.get("/shipments/codecar/:id", apiController.getProductsFromShipmentsByCodeCar);
apiRouter.post("/shipments", apiController.createShipment);
apiRouter.put("/shipments", apiController.updateStatusOfShipments);
apiRouter.delete("/shipments/:id", apiController.deleteShipment);

apiRouter.get("/consignees", apiController.getConsignees);
apiRouter.get("/consignees/:id", apiController.getConsigneeById);
apiRouter.post("/consignees", apiController.createConsignee);
apiRouter.put("/consignees", apiController.updateConsignee);
apiRouter.delete("/consignees/:id", apiController.deleteConsignee);

apiRouter.get("/warehouses", apiController.getWarehouses);
apiRouter.get("/warehouses/products", apiController.getWarehouseProducts);
apiRouter.get("/warehouses/:id", apiController.getWarehouseById);
apiRouter.post("/warehouses", apiController.createWarehouse);
apiRouter.post("/warehouses", apiController.addProductsToWarehouse);
apiRouter.put("/warehouses", apiController.updateWarehouse);
apiRouter.put("/warehouse/quantity", apiController.minusQuantutyOfGoodsFromWarehouse);
apiRouter.put("/warehouse/editquantity", apiController.addQuantutyOfGoodsToWarehouse);
apiRouter.put("/warehouse/return", apiController.returnQuantutyOfProductsToWarehouse);
apiRouter.delete("/warehouses/:id", apiController.deleteWarehouse);

apiRouter.post("/shipmentstottn", apiController.createShipmentsToTTN);

apiRouter.get("/ttn/:id", apiController.getTTNwithProducts);
apiRouter.post("/ttn", apiController.createTTN);
apiRouter.put("/ttn", apiController.updateTTN);
apiRouter.delete("/ttn/:id", apiController.deleteTTN);
apiRouter.get("/ttns", apiController.getTTNs);
apiRouter.get("/ttns/last", apiController.getLastAddedTTN);

apiRouter.get("/remainders", apiController.getRemainders);

export { apiRouter };