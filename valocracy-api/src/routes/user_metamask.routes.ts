import express, { Request, Response } from 'express';

import Controller from '@/controllers/UserMetamaskController';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const router = express.Router();

router.post('/is_owner', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();
		
		await controller.isOwnerOfAddress(req, res);
	}
]);

router.post('/sync', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();
		
		await controller.syncWallet(req, res);
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
