import async from 'async';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Product, TProduct } from '../models/product';
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
		// Search for categories for input select options
		Category.find({}, 'name').exec((err, categories) => {
			if (err) {
				return next(err);
			}
			// Successful, so render.
			res.render('productForm', {
				title: 'Create new product',
				categories,
			});
		});
	},
	deleteGetProduct() {},
	deletePostProduct() {},
	updateGetProduct() {},
	updatePostProduct() {},
	createPostProduct: [
		body('name', 'Name must not be empty').not().isEmpty().trim().escape(),
		body('description', 'Description must not be empty')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		body('category', 'Category must not be empty')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		body('price', 'Price must not be empty')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.isNumeric(),
		body('numberInStock', 'Number in stock must not be empty')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.isNumeric(),
		(req: Request, res: Response, next: NextFunction) => {
			// Handle errors from request
			const errors = validationResult(req);

			// There are errors, render form with errors
			if (!errors.isEmpty()) {
				Category.find({}, 'name').exec((err, categories) => {
					if (err) {
						return next(err);
					}
					// Successful, so render.
					res.render('productForm', {
						title: 'create new product',
						product: req.body,
						categories,
						errors: errors.array(),
					});
				});
				return;
			}
			// Data is valid, create new category with validated data
			const product = new Product({
				name: req.body.name,
				description: req.body.description,
				category: req.body.category,
				price: req.body.price,
				numberInStock: req.body.numberInStock,
			});
			product.save(err => {
				if (err) {
					next(err);
					return;
				}

				console.log(`New product:${product}`);

				// Success, redirect to the new category url
				res.redirect(product.url);
			});
		},
	],
};

export default productController;
