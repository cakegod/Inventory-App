import { HttpException } from './HttpsException';

export { HttpException };

interface IError extends Error {
	status?: number;
}

export { IError };
