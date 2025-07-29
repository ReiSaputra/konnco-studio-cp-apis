import express from 'express';

import { getProductController, getProductDetailController } from '../controllers/product-controller.js';

const productRoute = express.Router();

productRoute.get("/products", getProductController);
productRoute.get("/products/:productId", getProductDetailController);

export { productRoute };