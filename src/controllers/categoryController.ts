import async from 'async';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Product } from '../models/product';
import { Category, TCategory } from '../models/category';
import { IError } from '../types';
import { CallbackError } from 'mongoose';

const categoryController = {
	displayCategoriesList(req: Request, res: Response, next: NextFunction) {
		Category.find({})
			.sort({ title: 1 })

			.exec((err, categoryList) => {
				if (err) {
					return next(err);
				}
				res.render('categoryList', {
					title: 'Category List',
					categoryList,
				});
			});
	},
	displayCategoryDetails(req: Request, res: Response, next: NextFunction) {
		async.parallel(
			{
				category(callback) {
					Category.findById(req.params.id).exec(callback);
				},
				categoryProducts(callback) {
					Product.find({ category: req.params.id }).exec(callback);
				},
			},
			(err, results) => {
				if (err) {
					return next(err);
				}
				if (results.category == null) {
					// No results.
					const newError: IError = new Error('Category not found');
					newError.status = 404;
					return next(newError);
				}
				res.render('categoryDetails', {
					title: results.category.name,
					category: results.category,
					productList: results.categoryProducts,
				});
			}
		);
	},
	updateGetCategory(req: Request, res: Response, next: NextFunction) {
		Category.findById(req.params.id).exec((err, category) => {
			if (err) {
				return next(err);
			}
			res.render('categoryForm', {
				title: `Update ${category.name}`,
				category,
			});
		});
	},
	updatePostCategory: [
		body('name', 'Name must not be empty').not().isEmpty().trim().escape(),
		body('description', 'Description must not be empty')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		(req: Request, res: Response, next: NextFunction) => {
			// Handle errors from request
			const errors = validationResult(req);

			// There are errors, render form with errors
			if (!errors.isEmpty()) {
				res.render('categoryForm', {
					title: 'Create new category',
					category: req.body,
					errors: errors.array(),
				});
				return;
			}
			// Data is valid, find category and update
			const category = new Category({
				name: req.body.name,
				description: req.body.description,
				_id: req.params.id,
			});
			Category.findByIdAndUpdate(req.params.id, category, {}, err => {
				if (err) {
					next(err);
					return;
				}

				console.log(`New Category:${category}`);

				// Success, redirect to the new category url
				res.redirect(category.url);
			});
		},
	],

	createGetCategory(req: Request, res: Response, next: NextFunction) {
		// Successful, so render.
		res.render('categoryForm', {
			title: 'Create new category',
		});
	},
	createPostCategory: [
		body('name', 'Name must not be empty').not().isEmpty().trim().escape(),
		body('description', 'Description must not be empty')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		(req: Request, res: Response, next: NextFunction) => {
			// Handle errors from request
			const errors = validationResult(req);

			// There are errors, render form with errors
			if (!errors.isEmpty()) {
				res.render('categoryForm', {
					title: 'Create new category',
					category: req.body,
					errors: errors.array(),
				});
				return;
			}
			// Data is valid, create new category with validated data
			const category = new Category({
				name: req.body.name,
				description: req.body.description,
			});
			category.save(err => {
				if (err) {
					next(err);
					return;
				}

				console.log(`New Category:${category}`);

				// Success, redirect to the new category url
				res.redirect(category.url);
			});
		},
	],

	deleteGetCategory(req: Request, res: Response, next: NextFunction) {},
	deletePostCategory(req: Request, res: Response, next: NextFunction) {
		Category.findByIdAndRemove(req.params.id, (err: CallbackError) => {
			if (err) {
				return next(err);
			}
			res.redirect('/categories');
		});
	},
};

export default categoryController;
