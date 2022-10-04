import async from 'async';
import { NextFunction, Request, Response } from 'express';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { IError } from '../types';

const productController = {
	displayHomepage(req: Request, res: Response) {
		async.parallel(
			{
				productsCount(callback) {
					Product.countDocuments({}, callback);
				},
				categoriesCount(callback) {
					Category.countDocuments({}, callback);
				},
			},
			(err, results) => {
				res.render('index', {
					title: 'Home',
					error: err,
					data: results,
				});
			}
		);
	},
	displayProductsList(req: Request, res: Response, next: NextFunction) {
		Product.find({})
			.sort({ title: 1 })
			.populate('category')
			.exec((err, productList) => {
				if (err) {
					return next(err);
				}
				res.render('productList', {
					title: 'Product List',
					productList,
				});
			});
	},
	displayProductDetails(req: Request, res: Response, next: NextFunction) {
		async.parallel(
			{
				product(callback) {
					Product.findById(req.params.id)
						.populate('category')
						.exec(callback);
				},
			},
			(err, results) => {
				if (err) {
					return next(err);
				}
				if (results.product == null) {
					// No results.
					const newError: IError = new Error('Product not found');
					newError.status = 404;
					return next(newError);
				}
				// Successful, so render.
				res.render('productDetails', {
					title: results.product.name,
					product: results.product,
				});
			}
		);
	},

	createGetProduct(req: Request, res: Response, next: NextFunction) {
		Category.find({}, 'name').exec((err, categories) => {
			if (err) {
				return next(err);
			}
			// Successful, so render.
			res.render('productForm', {
				title: 'Create new Product',
				categories,
			});
		});
	},
	deleteGetProduct() {},
	deletePostProduct() {},
	updateGetProduct() {},
	updatePostProduct() {},
	createPostProduct() {},
};

export default productController;
