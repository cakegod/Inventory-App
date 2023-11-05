import { Schema, model, InferSchemaType } from 'mongoose';

const CategorySchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
	},
	{
		virtuals: {
			url: {
				get() {
					return `/categories/${this._id}`;
				},
			},
		},
	},
);

const CategoryModel = model('Category', CategorySchema);

type Category = InferSchemaType<typeof CategorySchema>;

export { CategoryModel, Category };
