import async from 'async';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { CallbackError } from 'mongoose';
import { Product } from '../models/product';
import { Category } from '../models/category';

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
		Product.findById(req.params.id)
			.populate('category')
			.exec((err, product) => {
				if (err) {
					return next(err);
				}
				res.render('productDetails', {
					title: product.name,
					product,
				});
			});
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
	deletePostProduct(req: Request, res: Response, next: NextFunction) {
		Product.findByIdAndDelete(req.params.id, (err: CallbackError) => {
			if (err) {
				return next(err);
			}
			res.redirect('/products');
		});
	},
	updateGetProduct(req: Request, res: Response, next: NextFunction) {
		async.parallel(
			{
				product(callback) {
					Product.findById(req.params.id, callback);
				},
				categories(callback) {
					Category.find({}, callback);
				},
			},
			(err, results) => {
				res.render('productForm', {
					title: 'Home',
					error: err,
					product: results.product,
					selectedCategory: results.product.category.toString(),
					categories: results.categories,
				});
			}
		);
	},
	updatePostProduct: [
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
					console.log(categories, req.body.category);
					res.render('productForm', {
						title: 'create new product',
						product: req.body,
						selectedCategory: req.body.category,
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
				_id: req.params.id,
			});
			Product.findByIdAndUpdate(req.params.id, product, {}, err => {
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
					console.log(categories, req.body.category);
					res.render('productForm', {
						title: 'create new product',
						product: req.body,
						selectedCategory: req.body.category,
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
