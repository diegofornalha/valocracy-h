import { Request, Response } from 'express';

import Controller from './Controller';
import HotmartAccountService from '@/services/HotmartAccountService';
import { HotmartAccountInterface } from '@/interfaces/HotmartAccountInterface';
import { getErrorMessage, getSuccessMessage } from '@/helpers/response_collection';
import { isUserAdm } from '@/helpers/permission_system';

class HotmartAccountController extends Controller{
	private service: HotmartAccountService;

	constructor() {
		super();
		this.service = new HotmartAccountService();
	}

	async isEmailActiveInList(req: Request, res: Response) {
		try {
			const email: string = req.params.email;

			const isValidEmail = await this.service.isEmailActiveInList(email);

			return this.sendSuccessResponse(res, { content: {is_valid_email: isValidEmail} });
		} catch (err) {
			this.sendErrorMessage(res, err, 'ApplicationKey');
		}
	}

	async fetchAll(req: Request, res: Response) {
		try {
			const userId: number = res.locals.jwt.user_id;

			const userIsAdm = await isUserAdm(userId);
			if(!userIsAdm) throw Error(getErrorMessage('invalidTypeOfAuth'));
			
			const hotmartAccounts = await this.service.fetchAll();

			return this.sendSuccessResponse(res, { content: hotmartAccounts });
		} catch (err) {
			this.sendErrorMessage(res, err, 'ApplicationKey');
		}
	}

	async update(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const hotmartId: string = req.params.hotmart_id;

			const userIsAdm = await isUserAdm(userId);
			if(!userIsAdm) throw Error(getErrorMessage('invalidTypeOfAuth'));

			const body: HotmartAccountInterface = req.body;

			await this.service.update(body, hotmartId);

			return this.sendSuccessResponse(res, { message: getSuccessMessage('update', 'Conta do Hotmart') });
		} catch (err) {
			this.sendErrorMessage(res, err, 'ProjectAccountController');
		}
	}
}

export default HotmartAccountController;