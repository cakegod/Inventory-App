import express from 'express';
import productController from '../controllers/productController';

const router = express.Router();

router.route('/').get(productController.index);

export default router;
