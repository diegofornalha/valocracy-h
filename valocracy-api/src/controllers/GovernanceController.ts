/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

import Controller from './Controller';
import GovernanceService from '@/services/GovernanceService';
import { Vote } from '@/interfaces/VoteInterface';
import { Proposal } from '@/interfaces/ProposalInterface';
import ProposalService from '@/services/ProposalService';
import TreasuryService from '@/services/TreasuryService';

class GovernanceController extends Controller {
	private service: GovernanceService;

	constructor() {
		super();

		TreasuryService.initialize();
		this.service = new GovernanceService();
	}

	async fetchAll(req: Request, res: Response) {
		try {
			const proposalService = new ProposalService();
			const userId: number = Number(res.locals.jwt.user_id);

			const proposals = await proposalService.fetchAllAndUserVote(userId);
			return this.sendSuccessResponse(res, { content: proposals });
		} catch (err) {
			this.sendErrorMessage(res, err, 'GovernanceController[FetchAll]');
		}
	}

	async fetchProposalUsersAnswer(req: Request, res: Response) {
		try {
			const proposalService = new ProposalService();
			const proposalId: number = Number(req.params.proposal_id);

			const proposals = await proposalService.fetchProposalUsersAnswer(proposalId);
			return this.sendSuccessResponse(res, { content: proposals });
		} catch (err) {
			this.sendErrorMessage(res, err, 'GovernanceController[FetchAll]');
		}
	}

	async fetch(req: Request, res: Response) {
		try {
			const proposalService = new ProposalService();
			const proposalId: number = Number(req.params.proposal_id);
			const userId: number = Number(res.locals.jwt.user_id);

			const proposal = await proposalService.fetchByProposalAndUser(proposalId, userId);
			return this.sendSuccessResponse(res, { content: proposal });
		} catch (err) {
			this.sendErrorMessage(res, err, 'GovernanceController[FetchAll]');
		}
	}

	async fetchMyPower(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);

			const myPower = await this.service.fetchMyPower(userId);
			return this.sendSuccessResponse(res, { content: myPower });
		} catch (err) {
			this.sendErrorMessage(res, err, 'GovernanceController[FetchMyPower]');
		}
	}

	async vote(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const body: Vote = req.body;

			body.user_account_id = userId;
			const voteId = await this.service.vote(body);
			return this.sendSuccessResponse(res, { content: { vote_id: voteId } });
		} catch (err) {
			this.sendErrorMessage(res, err, 'GovernanceController[Vote]');
		}
	}

	async close(req: Request, res: Response) {
		try {
			const proposalId: number = Number(req.params.proposal_id);
		
			await this.service.close(proposalId);
			return this.sendSuccessResponse(res, { message: 'Proposal closed!' });
		} catch (err) {
			this.sendErrorMessage(res, err, 'GovernanceController[Close]');
		}
	}

	async open(req: Request, res: Response) {
		try {
			const body: Proposal = req.body;

			const proposalId = await this.service.open(body);
			return this.sendSuccessResponse(res, { content: { proposal_id: proposalId } });
		} catch (err) {
			console.log(err);
			this.sendErrorMessage(res, err, 'EffortRarity[Open]');
		}
	}
}

export default GovernanceController;