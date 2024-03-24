import { Request, Response } from 'express';

import Controller from './Controller';
import EffortService from '@/services/EffortService';
import { getErrorMessage } from '@/helpers/response_collection';
import { isUserAdm } from '@/helpers/permission_system';
import TreasuryService from '@/services/TreasuryService';
import UserMetamaskService from '@/services/UserMetamaskService';

class EffortController extends Controller {
	private service: EffortService;

	constructor() {
		super();
		TreasuryService.initialize();
		this.service = new EffortService();
	}

	async fetch(req: Request, res: Response) {
		try {
			const effortId: string = req.params.effort_id;
			const effort = await this.service.fetch(effortId);
			const effortShares = await this.service.getEffortShares(effortId);

			return this.sendSuccessResponse(res, {
				content: { ...effort, ...effortShares },
			});
		} catch (err) {
			console.log(err);
			this.sendErrorMessage(res, err, 'EffortRarity[FetchAll]');
		}
	}

	async fetchAll(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const efforts = await this.service.fetchByUser(userId);

			return this.sendSuccessResponse(res, { content: efforts });
		} catch (err) {
			console.log(err);
			this.sendErrorMessage(res, err, 'EffortRarity[FetchAll]');
		}
	}

	async fetchSharesOfEffort(req: Request, res: Response) {
		try {
			const effortId: string = req.params?.effort_id || '';
			const effortShares = await this.service.getEffortShares(effortId);

			return this.sendSuccessResponse(res, { content: effortShares });
		} catch (err) {
			console.log(err);
			this.sendErrorMessage(res, err, 'EffortRarity[FetchAll]');
		}
	}

	async generateEffort(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);

			const userWalletService = new UserMetamaskService();
			const userWallet = await userWalletService.fetchByUserAccount(
				req.body.user_account_id
			);

			if (!(await isUserAdm(userId)))
				throw Error(getErrorMessage('userActionNotPermitted'));
			if (userWallet.length === 0)
				throw Error(getErrorMessage('missingUserWalletConnectin'));

			const effortInfo = await this.service.generateEffort(req.body);

			return this.sendSuccessResponse(res, {
				content: { ...effortInfo, address_to_mint: userWallet[0].address },
			});
		} catch (err) {
			console.log(err);
			this.sendErrorMessage(res, err, 'EffortRarity[FetchAll]');
		}
	}

	async update(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const effortId: string = req.params.effort_id;

			if (!(await isUserAdm(userId)))
				throw Error(getErrorMessage('userActionNotPermitted'));

			const effortInfo = await this.service.update(req.body, effortId);

			return this.sendSuccessResponse(res, { content: effortInfo });
		} catch (err) {
			console.log(err);
			this.sendErrorMessage(res, err, 'EffortRarity[Update]');
		}
	}
}

export default EffortController;
