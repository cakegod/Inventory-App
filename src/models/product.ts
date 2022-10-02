import { Schema, model, Types } from 'mongoose';
import { IProduct } from 'src/types';

const Product = new Schema<IProduct>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	category: {
		type: Schema.Types.ObjectId,
		ref: 'CategoryModel',
		required: true,
	},
	price: { type: Number, required: true },
	numberInStock: { type: Number, required: true },
});

Product.virtual('URL').get(function () {
	return `/product/${this._id}`;
});

const ProductModel = model<IProduct>('products', Product);

export default ProductModel;
