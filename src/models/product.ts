import { Schema, model, Types } from 'mongoose';
import { IProduct } from 'src/types';

const ProductSchema = new Schema<IProduct>({
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

const Product = model<IProduct>('Product', ProductSchema);

export default Product;
