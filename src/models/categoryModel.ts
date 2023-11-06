import { InferSchemaType, model, Schema } from 'mongoose';

const CategorySchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
	},
	{
		// Virtuals have to be directly added to be inferred by InferSchemaType
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
