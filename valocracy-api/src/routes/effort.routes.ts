import express from 'express';

import Controller from '@/controllers/EffortController';
import { Request, Response } from 'express';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const effortRouter = express.Router();

effortRouter.get('', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchAll(req, res);
	}
]);

effortRouter.get('/:effort_id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetch(req, res);
	}
]);

effortRouter.get('/shares/of_effort/:effort_id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchSharesOfEffort(req, res);
	}
]);

effortRouter.post('/generate', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.generateEffort(req, res);
	}
]);

effortRouter.put('/:effort_id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.update(req, res);
	}
]);

// effortRouter.post('/test_generate_nft', [
// 	jwtMiddleware.validJWTNeeded,
// 	async (req: Request, res: Response): Promise<void> => {
// 		const controller = new Controller();

// 		await controller.testGenerateNFT(req, res);
// 	}
// ]);

export default effortRouter;
