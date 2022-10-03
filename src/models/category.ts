import { Schema, model } from 'mongoose';
import { ICategory } from 'src/types';

const CategorySchema = new Schema<ICategory>({
	name: { type: String, required: true },
	description: { type: String, required: true },
});

CategorySchema.virtual('url').get(function () {
	return `/category/${this._id}`;
});

const Category = model<ICategory>('Category', CategorySchema);

export default Category;
