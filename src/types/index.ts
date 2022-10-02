import { Types } from 'mongoose';
import { HttpException } from './HttpsException';

export { HttpException };

interface IProduct {
	name: string;
	description: string;
	category: Types.ObjectId;
	price: number;
	numberInStock: number;
	_id?: Types.ObjectId;
}

interface ICategory {
	name: string;
	description: string;
	_id?: Types.ObjectId;
}

export { IProduct, ICategory };
