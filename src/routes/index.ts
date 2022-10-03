import express from 'express';
import categoryController from '../controllers/categoryController';
import productController from '../controllers/productController';

const router = express.Router();

router.get('/', productController.displayHomepage);

router.get('/products', productController.displayProductsList);
router.get('/categories', categoryController.displayCategoriesList);

// Delete product
router
	.route('/product/:id/delete')
	.get(productController.deleteGetProduct)
	.post(productController.deletePostProduct);

// Update product
router
	.route('/product/:id/update')
	.get(productController.updateGetProduct)
	.post(productController.updatePostProduct);

// Create product
router
	.route('/product/create')
	.get(productController.createGetProduct)
	.post(productController.createPostProduct);

// Read product
router.get('/product/:id', productController.displayProductDetails);

// Delete category
router
	.route('/category/:id/delete')
	.get(categoryController.deleteGetCategory)
	.post(categoryController.deletePostCategory);

// Update category
router
	.route('/category/:id/update')
	.get(categoryController.updateGetCategory)
	.post(categoryController.updatePostCategory);

// Create category
router
	.route('/category/create')
	.get(categoryController.createGetCategory)
	.post(categoryController.createPostCategory);

// Read category
router.get('/category/:id', categoryController.displayCategoryProducts);

export default router;
