import express from 'express';

import Controller from '@/controllers/EconomyController';
import { Request, Response } from 'express';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const economyRouter = express.Router();

economyRouter.get('/my_share', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchMyShare(req, res);
	}
]);

economyRouter.get('/effort_share/:effort_id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchShareOfEffort(req, res);
	}
]);

economyRouter.get('/treasury_balance', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchTreasuryBalance(req, res);
	}
]);

economyRouter.post('/claim/effort', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.claimByEffort(req, res);
	}
]);

economyRouter.post('/claim', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.claimAllEfforts(req, res);
	}
]);

export default economyRouter;
