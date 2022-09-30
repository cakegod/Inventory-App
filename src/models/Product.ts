import {Schema, model} from 'mongoose';

const Product = new Schema({
  name:{type: String, required: true},
  description:{type: String, required: true},
  category:{type: Schema.Types.ObjectId, ref: 'Category', required: true},
  price:{type: Number, required: true},
  numberInStock:{type: Number, required: true},
});

Product.virtual('URL').get(function () {
  return `/product/${this._id}`;
});

const ProductSchema = model('ProductSchema', Product);

export default ProductSchema;