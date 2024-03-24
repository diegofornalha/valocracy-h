import { Application } from 'express';

import expressLoader from './express';
import databaseLoader from './database';

export default async (app: Application) => {
	console.log('Initializing loaders...');

	expressLoader(app);
	databaseLoader();

	console.log('Express loaded.');
};
