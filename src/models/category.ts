import { Schema, model } from 'mongoose';
import { ICategory } from 'src/types';

const Category = new Schema<ICategory>({
	name: { type: String },
	description: { type: String },
});

Category.virtual('url').get(function () {
	return `/category/${this._id}`;
});

const CategoryModel = model<ICategory>('categories', Category);

export default CategoryModel;
