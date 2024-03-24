import express from 'express';

import Controller from '@/controllers/EffortNatureController';
import { Request, Response } from 'express';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const effortNatureRouter = express.Router();

effortNatureRouter.get('/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetch(req, res);
	}
]);

effortNatureRouter.get('', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchAll(req, res);
	}
]);

export default effortNatureRouter;
