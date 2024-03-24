import express, { Request, Response } from 'express';

import Controller from '@/controllers/ProjectController';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const router = express.Router();

router.get('', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();
		
		await controller.fetchAll(req, res);
	}
]);

router.get('/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();
		
		await controller.fetch(req, res);
	}
]);

router.post('', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();
		
		await controller.create(req, res);
	}
]);

router.put('/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();
		
		await controller.update(req, res);
	}
]);

router.delete('/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();
		
		await controller.remove(req, res);
	}
]);

export default router;
