import express, { Request, Response } from 'express';

import Controller from '@/controllers/RegistryController';

const router = express.Router();

router.get('/validate_email_code/id/:id/code/:code', [
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.validateEmail(req, res);
	}
]);

router.post('/send_email_validation_code', [
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();
		
		await controller.sendValidationCode(req, res);
	}
]);

export default router;