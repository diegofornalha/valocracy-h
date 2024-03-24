import express from 'express';

import Controller from '@/controllers/AuthController';
import AuthMiddleware from '@/middlewares/auth.middleware';
import { Request, Response } from 'express';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const authRouter = express.Router();

authRouter.post('/send_email_login_code', [
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.sendLoginCode(req, res);
	}
]);

authRouter.post('', [
	AuthMiddleware.verifyUserPassword,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.createJWT(req, res);
	}
]);

authRouter.get('/validate_jwt', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		res.status(200).send();
	}
]);

// authRouter.post('/refresh-token', [
// 	JwtMiddleware.validJWTNeeded,
// 	JwtMiddleware.verifyRefreshBodyField,
// 	// JwtMiddleware.validRefreshNeeded,
// 	await controller.createJWT.bind(controller),
// ]);

export default authRouter;
