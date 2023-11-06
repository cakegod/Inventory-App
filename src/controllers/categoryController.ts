import { NextFunction, Request, Response } from 'express';
import { CategoryModel } from '@models/categoryModel';
import createHttpError from 'http-errors';
import { constants as HTTP_CONSTANTS } from 'http2';
import { body, validationResult } from 'express-validator';

function validateProduct() {
	return [
		body('name', 'Name must not be empty').not().isEmpty().trim().escape(),
		body('description', 'Description must not be empty')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		async (req: Request, res: Response, next: NextFunction) => {
			if (!validationResult(req).isEmpty()) {
				res.json(validationResult(req).array());
			}

			next();
		},
	];
}

async function getAll(_req: Request, res: Response) {
	const categories = await CategoryModel.find().sort({ title: 1 });

	res.json(categories);
}

async function getOne(req: Request, res: Response) {
	const category = await CategoryModel.findById(req.params.id);

	if (!category) {
		throw createHttpError.NotFound();
	}

	res.json(category);
}

async function createOne(req: Request, res: Response) {
	const category = new CategoryModel(req.body);

	await category.save();
	res.location(category.url).status(HTTP_CONSTANTS.HTTP_STATUS_CREATED).end();
}

async function deleteOne(req: Request, res: Response) {
	const category = await CategoryModel.findByIdAndDelete(req.params.id);

	if (!category) {
		throw createHttpError.NotFound();
	}

	res.status(HTTP_CONSTANTS.HTTP_STATUS_NO_CONTENT).end();
}

async function updateOne(req: Request, res: Response) {
	const category = await CategoryModel.findByIdAndUpdate(
		req.params.id,
		req.body,
	);

	if (!category) {
		throw createHttpError.NotFound();
	}

	res.status(HTTP_CONSTANTS.HTTP_STATUS_NO_CONTENT).end();
}

const categoryController = {
	getAll,
	getOne,
	createOne,
	validateProduct,
	deleteOne,
	updateOne,
};

export default categoryController;
