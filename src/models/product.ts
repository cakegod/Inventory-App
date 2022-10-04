import { Schema, model, InferSchemaType } from 'mongoose';

const ProductSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
	},
	price: { type: Number, required: true },
	numberInStock: { type: Number, required: true },
});

ProductSchema.virtual('url').get(function () {
	return `/product/${this._id}`;
});

const Product = model('Product', ProductSchema);

type TProduct = InferSchemaType<typeof ProductSchema>;

export { Product, TProduct };
