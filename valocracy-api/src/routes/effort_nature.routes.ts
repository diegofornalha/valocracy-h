import express from 'express';

import Controller from '@/controllers/EffortRarityController';
import { Request, Response } from 'express';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const effortRarityRouter = express.Router();

effortRarityRouter.get('/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetch(req, res);
	}
]);

effortRarityRouter.get('', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchAll(req, res);
	}
]);

export default effortRarityRouter;
