import express from 'express';
import * as productController from '../controllers/product.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(productController.getProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router.get('/low-stock', productController.getLowStockProducts);
router.get('/expiring', productController.getExpiringProducts);
router.get('/search', productController.searchProducts);
router.get('/categories', productController.getProductCategories);
router.get('/inventory-value', productController.getInventoryValue);

export default router;
