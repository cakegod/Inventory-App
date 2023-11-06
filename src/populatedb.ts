import { config } from 'dotenv';
import { Product, ProductModel } from '@models/productModel';
import mongoose from 'mongoose';
import { Category, CategoryModel } from '@models/categoryModel';
import db from './database';

config();

db.connect(process.env.MONGO_URI!);

const products: (Product & mongoose.Document)[] = [];
const categories: (Category & mongoose.Document)[] = [];

const createProduct = async (obj: Product) => {
	const product = new ProductModel(obj);
	try {
		await product.save();
		console.log(`New Product:${product}`);
		products.push(product);
	} catch (err) {
		console.error(err);
	}
};

const createCategory = async (obj: Category) => {
	const category = new CategoryModel(obj);
	try {
		await category.save();
		console.log(`New Category:${category}`);
		categories.push(category);
	} catch (err) {
		console.error(err);
	}
};

const populateProducts = async () => {
	const createProductPromises = [
		await createProduct({
			name: 'productOne',
			description: 'Some description...',
			category: categories[0]._id,
			price: 4,
			numberInStock: 5,
		}),
		await createProduct({
			name: 'productTwo',
			description: 'Some description...',
			category: categories[0]._id,
			price: 3,
			numberInStock: 3,
		}),
		await createProduct({
			name: 'productThree',
			description: 'Some description...',
			category: categories[1]._id,
			price: 2,
			numberInStock: 1,
		}),
		await createProduct({
			name: 'productThree',
			description: 'Some description...',
			category: categories[2]._id,
			price: 8,
			numberInStock: 7,
		}),
	];

	try {
		await Promise.all(createProductPromises);
	} catch (error) {
		console.error('An error occurred:', error);
	}
};

const populateCategories = async () => {
	const createCategoryPromises = [
		await createCategory({
			name: 'firstCategory',
			description: 'Some description...',
		}),

		await createCategory({
			name: 'secondCategory',
			description: 'Some description...',
		}),

		await createCategory({
			name: 'thirdCategory',
			description: 'Some description...',
		}),
	];

	try {
		await Promise.all(createCategoryPromises);
	} catch (error) {
		console.error('An error occurred:', error);
	}
};

// To run promises sequentially, otherwise products won't be able to access categories
[populateCategories, populateProducts].reduce(async (previous, current) => {
	await previous;
	return current();
}, Promise.resolve());
