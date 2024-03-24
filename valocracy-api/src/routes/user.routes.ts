import express, { Request, Response } from 'express';

import Controller from '@/controllers/UserController';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const router = express.Router();

router.get('', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetch(req, res);
	}
]);

router.get('/all', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchAll(req, res);
	}
]);

router.get('/is_unique/username/:username', [
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchIsUsernameUnique(req, res);
	}
]);

router.get('/is_unique/email/:email', [
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchIsEmailUnique(req, res);
	}
]);

router.post('', [
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		controller.create(req, res);
	}
]);

router.put('', [
	jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.update(req, res);
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