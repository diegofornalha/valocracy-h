import express, { Request, Response } from 'express';

import Controller from '@/controllers/HotmartAccountController';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const router = express.Router();

router.get('/', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchAll(req, res);
	},
]);

router.put('/:hotmart_id', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.update(req, res);
	},
]);

export default router;
