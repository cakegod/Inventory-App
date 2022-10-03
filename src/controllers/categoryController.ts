import async from 'async';
import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';
import Category from '../models/category';
import { IError } from '../types';

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
	displayCategoryProducts(req: Request, res: Response, next: NextFunction) {
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
				res.render('categoryProducts', {
					title: results.category.name,
					category: results.category,
					productList: results.categoryProducts,
				});
			}
		);
	},
	updateGetCategory() {},
	updatePostCategory() {},
	createGetCategory(req: Request, res: Response, next: NextFunction) {
		// Successful, so render.
		res.render('categoryForm', {
			title: 'Create new Category',
		});
	},
	createPostCategory() {},
	deleteGetCategory() {},
	deletePostCategory() {},
};

export default categoryController;
