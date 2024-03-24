import { Request, Response } from 'express';

import Controller from './Controller';
import EffortNatureService from '@/services/EffortNatureService';
import { EffortNature } from '@/interfaces/EffortNatureInterface';

class EffortNatureController extends Controller {
	private service: EffortNatureService;

	constructor() {
		super();
		this.service = new EffortNatureService();
	}

	async fetch(req: Request, res: Response) {
		try {
			const id: number = parseInt(req.params.id);

			const effortNature: EffortNature | null  = await this.service.fetch(id);

			return this.sendSuccessResponse(res, { content: effortNature });
		} catch (err) {
			this.sendErrorMessage(res, err, 'effortNature[Fetch]');
		}
	}

	async fetchAll(req: Request, res: Response) {
		try {
			const effortNatures: Array<EffortNature> = await this.service.fetchAll();

			return this.sendSuccessResponse(res, { content: effortNatures });
		} catch (err) {
			this.sendErrorMessage(res, err, 'effortNature[FetchAll]');
		}
	}
}

export default EffortNatureController;