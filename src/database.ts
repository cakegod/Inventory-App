import mongoose from 'mongoose';

async function connect(url: string) {
	try {
		await mongoose.connect(url);
		mongoose.connection.on('error', () =>
			console.log('MongoDB connection error:'),
		);

		console.log('Database connection successful');
	} catch (e) {
		console.log(e);
	}
}

export default {
	connect,
};
