import { NextFunction, Request, Response, Router } from 'express';
import { ProductModel } from '@models/productModel';
import { CategoryModel } from '@models/categoryModel';
import productController from '@controllers/productController';
import categoryController from '@controllers/categoryController';

const router = Router();

type Callback = (
	req: Request,
	res: Response,
	next: NextFunction,
) => Promise<void>;

// To not have to wrap every function
function wrapper(cb: Callback) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await cb(req, res, next);
		} catch (err) {
			next(err);
		}
	};
}

router.get(
	'/',
	wrapper(async (req: Request, res: Response) => {
		const [productsCount, categoriesCount] = await Promise.all([
			ProductModel.countDocuments({}),
			CategoryModel.countDocuments({}),
		]);

		res.render('index', {
			title: 'Home',
			data: { productsCount, categoriesCount },
		});
	}),
);

// // Products
router
	.route('/products')
	.get(wrapper(productController.getAll))
	.post(
		productController.validateProduct(),
		wrapper(productController.createOne),
	);
router
	.route('/products/:id')
	.get(wrapper(productController.getOne))
	.delete(wrapper(productController.deleteOne))
	.put(
		productController.validateProduct(),
		wrapper(productController.updateOne),
	);
//

// Categories
router
	.route('/categories')
	.get(wrapper(categoryController.getAll))
	.post(
		categoryController.validateProduct(),
		wrapper(categoryController.createOne),
	);
router
	.route('/categories/:id')
	.get(wrapper(categoryController.getOne))
	.delete(wrapper(categoryController.deleteOne))
	.put(
		categoryController.validateProduct(),
		wrapper(categoryController.updateOne),
	);
//
export default router;
