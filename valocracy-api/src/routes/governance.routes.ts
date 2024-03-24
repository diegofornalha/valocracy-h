import express from 'express';

import Controller from '@/controllers/GovernanceController';
import { Request, Response } from 'express';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const governanceRouter = express.Router();

governanceRouter.get('/proposal', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchAll(req, res);
	}
]);

governanceRouter.get('/proposal/:proposal_id/votes', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchProposalUsersAnswer(req, res);
	}
]);

governanceRouter.get('/proposal/:proposal_id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetch(req, res);
	}
]);

governanceRouter.get('/my_power', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchMyPower(req, res);
	}
]);

governanceRouter.post('/proposal', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.open(req, res);
	}
]);

governanceRouter.put('/proposal/close/:proposal_id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.close(req, res);
	}
]);

governanceRouter.post('/proposal/vote', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.vote(req, res);
	}
]);

export default governanceRouter;
