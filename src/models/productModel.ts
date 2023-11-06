import { InferSchemaType, model, Schema } from 'mongoose';

const ProductSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		price: { type: Number, required: true },
		numberInStock: { type: Number, required: true },
	},
	{
		virtuals: {
			url: {
				get() {
					return `/products/${this._id}`;
				},
			},
		},
	},
);

const ProductModel = model('Product', ProductSchema);

type Product = InferSchemaType<typeof ProductSchema>;

export { ProductModel, Product };
