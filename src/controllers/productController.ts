import { NextFunction, Request, Response } from 'express';
import { ProductModel } from '@models/productModel';
import createHttpError from 'http-errors';
import { CategoryModel } from '@models/categoryModel';
import { body, validationResult } from 'express-validator';
import { constants as HTTP_CONSTANTS } from 'http2';

function validateProduct() {
	return [
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
			.custom(async value => {
				const categories = await CategoryModel.find({});
				if (!categories.some(c => c._id.toString() === value)) {
					throw new Error('Category does not exist');
				}
			})
			.escape(),
		body('price', 'Price must not be empty')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.isNumeric(),
		body('numberInStock').not().isEmpty().trim().escape().isNumeric(),
		async (req: Request, res: Response, next: NextFunction) => {
			if (!validationResult(req).isEmpty()) {
				res.json(validationResult(req).array());
			}

			next();
		},
	];
}

async function getAll(_req: Request, res: Response) {
	const products = await ProductModel.find()
		.sort({ title: 1 })
		.populate('category');

	res.json(products);
}

async function getOne(req: Request, res: Response) {
	const product = await ProductModel.findById(req.params.id)
		.sort({ title: 1 })
		.populate('category');

	if (!product) {
		throw createHttpError.NotFound();
	}

	res.json(product);
}

async function createOne(req: Request, res: Response) {
	const product = new ProductModel(req.body);

	await product.save();
	res.location(product.url).status(HTTP_CONSTANTS.HTTP_STATUS_CREATED).end();
}

async function deleteOne(req: Request, res: Response) {
	const product = await ProductModel.findByIdAndDelete(req.params.id);

	if (!product) {
		throw createHttpError.NotFound();
	}

	res.status(HTTP_CONSTANTS.HTTP_STATUS_NO_CONTENT).end();
}

async function updateOne(req: Request, res: Response) {
	const product = await ProductModel.findByIdAndUpdate(
		req.params.id,
		req.body,
	);

	if (!product) {
		throw createHttpError.NotFound();
	}

	res.status(HTTP_CONSTANTS.HTTP_STATUS_NO_CONTENT).end();
}

const productController = {
	getAll,
	getOne,
	createOne,
	validateProduct,
	deleteOne,
	updateOne,
};

export default productController;
