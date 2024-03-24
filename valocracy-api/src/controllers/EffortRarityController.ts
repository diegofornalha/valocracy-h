import { Request, Response } from 'express';

import Controller from './Controller';
import EffortRarityService from '@/services/EffortRarityService';
import { EffortRarity } from '@/interfaces/EffortRarityInterface';

class EffortRarityController extends Controller {
	private service: EffortRarityService;

	constructor() {
		super();
		this.service = new EffortRarityService();
	}

	async fetch(req: Request, res: Response) {
		try {
			const id: number = parseInt(req.params.id);

			const effortRarity: EffortRarity | null  = await this.service.fetch(id);

			return this.sendSuccessResponse(res, { content: effortRarity });
		} catch (err) {
			this.sendErrorMessage(res, err, 'EffortRarity[Fetch]');
		}
	}

	async fetchAll(req: Request, res: Response) {
		try {
			const effortRarities: Array<EffortRarity> = await this.service.fetchAll();

			return this.sendSuccessResponse(res, { content: effortRarities });
		} catch (err) {
			this.sendErrorMessage(res, err, 'EffortRarity[FetchAll]');
		}
	}
}

export default EffortRarityController;