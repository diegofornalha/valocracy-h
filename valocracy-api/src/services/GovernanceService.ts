import { Vote } from '@/interfaces/VoteInterface';
import VoteService from './VoteService';
import ProposalService from './ProposalService';
import { getErrorMessage } from '@/helpers/response_collection';
import { Proposal } from '@/interfaces/ProposalInterface';
import EffortService from './EffortService';
import UserService from './UserService';
import Database from '@/database/Database';
import ProposalUserPowerService from './ProposalUserPowerService';
import { ProposalUserPowerInterface } from '@/interfaces/ProposalUserPowerInterface';

export default class GovernanceService {
	private proposalService: ProposalService;
	private voteService: VoteService;

	constructor() {
		this.proposalService = new ProposalService();
		this.voteService = new VoteService();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async fetchMyPower(userId: number): Promise<any> {
		const effortService = new EffortService();

		const power: number = await effortService.fetchGovernancePowerOfUser(userId);
		const relativePower: number = await effortService.getRelativeGovernancePowerOfUser(userId);

		return { relative_power: relativePower || 0, power: power || 0 };
	}

	async vote(vote: Vote): Promise<number> {
		return await this.voteService.create(vote);
	}

	async close(proposalId: number) {
		await this.proposalService.closeVoting(proposalId);
	}

	async status(proposalId: number) {
		const proposal = await this.proposalService.fetch(proposalId);

		if(!proposal) throw Error(getErrorMessage('registryNotFound', 'Proposta'));
		return await this.proposalService.proposalActivityStatus(proposal);
	}

	async open(proposal: Proposal) {
		const userService = new UserService();
		const proposalUserService = new ProposalUserPowerService();
		const users = await userService.fetchAll();

		try {
			Database.startTransaction();
			const proposalId = await this.proposalService.create(proposal);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const usersPowerInfo = await Promise.all(users.map(async (user: any) => {
				const powerInfo = await this.fetchMyPower(user.id);

				return { ...powerInfo, user_account_id: user.id };
			}));
		
			await Promise.all(usersPowerInfo.map(async (userPowerInfo: ProposalUserPowerInterface) => {
				await proposalUserService.create({
					...userPowerInfo,
					proposal_id: proposalId
				});
			}));
			Database.commit();

			return proposalId;
		} catch (err) {
			Database.rollback().catch(console.log);
			throw err;
		}

	}
}