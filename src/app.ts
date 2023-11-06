import express, { Request, Response } from 'express';
import createHttpError from 'http-errors';
import logger from 'morgan';
import helmet from 'helmet';
import { config } from 'dotenv';
import { constants as HTTP_CONSTANTS } from 'http2';
import indexRouter from './routes/index';
import { HttpException } from './types';
import db from './database';

config();

// Database

db.connect(process.env.MONGO_URI!);

// init express
const app = express();

// sets basic express settings
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// logger
if (app.get('env') === 'development') {
	app.use(logger('dev'));
}

// security
if (app.get('env') === 'production') {
	app.use(helmet());
}

// adds base routing
app.use('/', indexRouter);

// catch 404 and fwd
app.use((_req, _res, next) => {
	next(createHttpError(HTTP_CONSTANTS.HTTP_STATUS_NOT_FOUND));
});
// error handler
app.use((err: HttpException, req: Request, res: Response) => {
	if (req.app.get('env') === 'development') {
		res.locals.message = err;
		res.locals.error = err;
	} else {
		res.locals.message = {};
		res.locals.error = {};
	}

	// render error page
	res.status(err.status || HTTP_CONSTANTS.HTTP_STATUS_INTERNAL_SERVER_ERROR);
	res.render('error');
});

export { app };
