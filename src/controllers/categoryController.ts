import async from 'async';
import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';
import Category from '../models/category';
import mongoose from 'mongoose';

const categoryController = {
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
					const err = new Error('Category not found');
					err.status = 404;
					return next(err);
				}
				res.render('categoryProducts', {
					title: results.category.name,
					category: results.category,
					productList: results.categoryProducts,
				});
			}
		);
	},
};

export default categoryController;
