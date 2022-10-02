import express, { NextFunction, Request, Response } from 'express';
import path from 'path';

import createHttpError from 'http-errors';
import logger from 'morgan';
import helmet from 'helmet';

import mongoose from 'mongoose';

import { config } from 'dotenv';

import indexRouter from './routes/index';
import { HttpException } from './types';

config();

// Database

const mongoDB = process.env.MONGO_URI!;
mongoose.connect(mongoDB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
} as mongoose.ConnectOptions);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// init express
const app = express();

// sets basic express settings
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine and statics primer
app.use(express.static(path.join(__dirname, '../', 'public')));
app.set('views', path.join(__dirname, '../', 'views'));
app.set('view engine', 'pug');

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
app.use((req, res, next) => {
	next(createHttpError(404));
});
// error handler
app.use((err: HttpException, req: Request, res: Response) => {
	res.locals.message = res.locals.error =
		req.app.get('env') === 'development' ? err : {};

	// render error page
	res.status(err.status || 500);
	res.render('error');
});

export { app };
