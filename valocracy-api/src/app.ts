import express, { Application } from 'express';
import env from '@/config';
import loaders from '@/loaders';

async function startServer() {
	const app: Application = express();

	await loaders(app);

	app.listen(env.PORT, () => {
		console.log(`
			##############################
			Server listening on port: ${env.PORT}
			##############################`);
	}).on('error', (err) => {
		console.log(err);
		process.exit(1);
	});
}

startServer();

// setTimeout(() => {
// console.log(mongoose.connections.length);
// mongoose.connection.db.listCollections().toArray(function (err, names) {
//   console.log(names);
// });
// }, 3000);
