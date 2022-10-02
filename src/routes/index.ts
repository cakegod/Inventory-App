import express from 'express';
import categoryController from '../controllers/categoryController';
import productController from '../controllers/productController';

const router = express.Router();

router.get('/', productController.index);
router.get('/products', productController.displayProductsList);
router.get('/product/:id', productController.displayProductDetails);
router.get('/category/:id', categoryController.displayCategoryProducts);

export default router;
