import { Request, Response } from 'express';

import { getErrorMessage, getSuccessMessage } from '@/helpers/response_collection';
import Controller from './Controller';
import { UserMetamaskInterface } from '@/interfaces/UserMetamaskInterface';
import UserMetamaskService from '@/services/UserMetamaskService';

class UserMetamaskController extends Controller {
	private service: UserMetamaskService;

	constructor() {
		super();
		this.service = new UserMetamaskService();
	}

	async isOwnerOfAddress(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const body: any = req.body;
			
			const result = await this.service.isUserOwnerOfAddress(body?.address, userId).catch(e => {
				if (e.message === getErrorMessage('walletNotFound')) return null;
				else throw e;
			});

			if (result !== null) {
				return this.sendSuccessResponse(res, { content: { is_owner: result, wallet_exist: true } });
			} else {
				return this.sendSuccessResponse(res, { content: { is_owner: false, wallet_exist: false } });
			}
		} catch (err) {
			this.sendErrorMessage(res, err, 'UserController');
		}
	}

	async syncWallet(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals?.jwt?.user_id);
			const body: UserMetamaskInterface = req.body;
			
			const userOldWallet = await this.service.fetchByUserAccount(userId);

			if (userOldWallet.length > 0) {
				await this.service.update(body, Number(userOldWallet[0].id));	
			} else {
				body.user_account_id = userId;
				await this.service.create(body);
			}

			return this.sendSuccessResponse(res, { message: getSuccessMessage('synced', 'Carteira') });
		} catch (err) {
			this.sendErrorMessage(res, err, 'UserController');
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			
			await this.service.removeByUser(userId);
			return this.sendSuccessResponse(res, { message: getSuccessMessage('delete', 'Vinculo com metamask') });
		} catch (err) {
			this.sendErrorMessage(res, err, 'UserController');
		}
	}
}

export default UserMetamaskController;
