import express, { Request, Response } from 'express';

import Controller from '@/controllers/DiscordController';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const router = express.Router();

// router.get('/authRedirect', [
// 	async (req: Request, res: Response): Promise<void> => {
// 		const controller = new Controller();

// 		await controller.authRedirect(req, res);
// 	}
// ]);

router.post('/registry', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.registry(req, res);
	}
]);

router.post('/syncDiscordUser', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.syncDiscordUser(req, res);
	}
]);

router.post('', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.create(req, res);
	}
]);

router.delete('', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.delete(req, res);
	}
]);

export default router;
