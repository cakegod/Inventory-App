import { Schema, model, InferSchemaType } from 'mongoose';

const CategorySchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
});

CategorySchema.virtual('url').get(function () {
	return `/category/${this._id}`;
});

const Category = model('Category', CategorySchema);

type TCategory = InferSchemaType<typeof CategorySchema>;

export { Category, TCategory };
