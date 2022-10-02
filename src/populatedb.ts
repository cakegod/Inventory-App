import mongoose, { Mongoose } from 'mongoose';
import async from 'async';
import { ICategory, IProduct } from 'src/types';
import { config } from 'dotenv';
import Product from './models/product';
import Category from './models/category';

config();

const mongoDB = process.env.MONGO_URI!;
mongoose.connect(mongoDB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
} as mongoose.ConnectOptions);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const products: IProduct[] = [];
const categories: ICategory[] = [];

const createProduct = (obj: IProduct, callback: mongoose.Callback) => {
	const product = new Product(obj);
	product.save(err => {
		if (err) {
			callback(err, null);
			return;
		}
		console.log(`New Product:${product}`);
		products.push(product);
		callback(null, product);
	});
};

const createCategory = (obj: ICategory, callback: mongoose.Callback) => {
	const category = new Category(obj);
	category.save(err => {
		if (err) {
			callback(err, null);
			return;
		}
		console.log(`New Category:${category}`);
		categories.push(category);
		callback(null, category);
	});
};

const populateProducts = (
	cb: async.AsyncResultArrayCallback<unknown, Error> | undefined
) => {
	async.series(
		[
			function (callback) {
				createProduct(
					{
						name: 'productOne',
						description: 'Some description...',
						category: categories[0]._id!,
						price: 4,
						numberInStock: 5,
					},
					callback
				);
			},
			function (callback) {
				createProduct(
					{
						name: 'productTwo',
						description: 'Some description...',
						category: categories[0]._id!,
						price: 3,
						numberInStock: 3,
					},
					callback
				);
			},
			function (callback) {
				createProduct(
					{
						name: 'productThree',
						description: 'Some description...',
						category: categories[1]._id!,
						price: 2,
						numberInStock: 1,
					},
					callback
				);
			},
			function (callback) {
				createProduct(
					{
						name: 'productThree',
						description: 'Some description...',
						category: categories[2]._id!,
						price: 8,
						numberInStock: 7,
					},
					callback
				);
			},
		],
		cb
	);
};

const populateCategories = (
	cb: async.AsyncResultArrayCallback<unknown, Error> | undefined
) => {
	async.series(
		[
			function (callback) {
				createCategory(
					{
						name: 'firstCategory',
						description: 'Some description...',
					},
					callback
				);
			},
			function (callback) {
				createCategory(
					{
						name: 'secondCategory',
						description: 'Some description...',
					},
					callback
				);
			},
			function (callback) {
				createCategory(
					{
						name: 'thirdCategory',
						description: 'Some description...',
					},
					callback
				);
			},
		],
		cb
	);
};

async.series([populateCategories, populateProducts]);
