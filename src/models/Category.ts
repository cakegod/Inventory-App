import { Schema, model } from 'mongoose';

const Category = new Schema({
  name:{type: String},
  description:{type: String},
});

Category.virtual('url').get(function() {
  return `/category/${this._id}`;
});

const CategorySchema = model('CategorySchema', Category);

export default CategorySchema;