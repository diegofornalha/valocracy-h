import express, { Request, Response } from 'express';

import Controller from '@/controllers/ExternalAccessController';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const router = express.Router();

router.post('/validation_code', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();
		
		await controller.sendValidationCode(req, res);
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
