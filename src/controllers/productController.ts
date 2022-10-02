import { Request, Response } from 'express';

const productController = {
	index(req: Request, res: Response) {
		res.render('index', { title: 'zaa' });
	},
};

export default productController;
