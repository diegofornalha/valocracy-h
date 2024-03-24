import { getErrorMessage } from '@/helpers/response_collection';
import ProposalDatabase from '@/database/ProposalDatabase';
import { Proposal } from '@/interfaces/ProposalInterface';
import { ProposalStatusEnum } from '@/enums/ProposalStatusEnum';
import EffortService from './EffortService';
import { percentOf } from '@/helpers/util';
import { ProposalVoteEnum } from '@/enums/ProposalVoteEnum';

class ProposalService {
	private database: ProposalDatabase;

	constructor() {
		this.database = new ProposalDatabase();
	}

	private async participantsAction(proposal: Proposal) {
		const totalPowerVoted: number = await this.fetchVotedQuorum(Number(proposal.id));

		return percentOf(totalPowerVoted, proposal.governance_power_balance);
	}

	private async percentOfVote(proposal: Proposal, vote: ProposalVoteEnum) {
		const proposalId: number = Number(proposal?.id);
		const voteTotalPower: number = await this.database.fetchVoteTotalPower(proposalId, vote);
		const totalPowerVoted: number = await this.fetchVotedQuorum(proposalId);
		
		return percentOf(voteTotalPower, totalPowerVoted);
	}

	async proposalActivityStatus(proposal: Proposal, isClosing = false) {
		if(proposal.status === ProposalStatusEnum.OPEN && !isClosing) {
			return ProposalStatusEnum.OPEN;
		} else if (await this.participantsAction(proposal) < 20) {
			return ProposalStatusEnum.INVALIDATED;
		} else if (await this.percentOfVote(proposal, ProposalVoteEnum.ABSTAIN) >= 50) {
			return ProposalStatusEnum.INVALIDATED;
		} else if (await this.percentOfVote(proposal, ProposalVoteEnum.VETO) >= 33.33) {
			return ProposalStatusEnum.VETOED;
		} else if (await this.percentOfVote(proposal, ProposalVoteEnum.NO) > await this.percentOfVote(proposal, ProposalVoteEnum.YES)) {
			return ProposalStatusEnum.REPROVED;
		}else {
			return ProposalStatusEnum.APPROVED;
		}
	}

	async fetch(id: number): Promise<Proposal | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id da proposta'));

		return await this.database.fetch(id);
	}

	async fetchByProposalAndUser(id: number, userId: number): Promise<Proposal | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id da proposta'));
		if (!userId) throw Error(getErrorMessage('missingField', 'Id do usuario'));

		return await this.database.fetchByProposalAndUser(id, userId);
	}

	async fetchProposalUsersAnswer(id: number): Promise<Array<Proposal>> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id da proposta'));

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const votes: Array<any> = await this.database.fetchProposalUsersAnswer(id);

		if(votes.length === 1) {
			if(votes[0]['answer'] === null && votes[0]['username'] === null) return [];
		}
		return votes;
	}

	async fetchAll(): Promise<Array<Proposal>> {
		return await this.database.fetchAll();
	}

	async fetchAllAndUserVote(userAccountId: number): Promise<Array<Proposal>> {
		return await this.database.fetchAllAndUserVote(userAccountId);
	}

	async fetchVotedQuorum(proposalId: number): Promise<number> {
		return await this.database.fetchVotedQuorum(proposalId);
	}

	async create(data: Proposal): Promise<number> {
		if (!data.title) throw Error(getErrorMessage('missingField', 'Titulo da proposta'));
		const effortService = new EffortService();

		const economyPowerBalance = await effortService.fetchTotalGovernancePower();
		const insertData: Proposal = {
			title: data.title,
			governance_power_balance: economyPowerBalance,
			status: ProposalStatusEnum.OPEN
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result:any = await this.database.create(insertData);
		return result[0].insertId;
	}

	async isClosed(proposalId: number) {
		const proposal = await this.fetch(proposalId);
	
		if(!proposal) throw Error(getErrorMessage('registryNotFound', 'Proposta'));
		if(proposal.status !== ProposalStatusEnum.OPEN) return true;
	}

	async closeVoting(proposalId: number) {
		if(await this.isClosed(proposalId)) throw Error('Proposal is already closed');
		const proposal = await this.fetch(proposalId);
	
		if(!proposal) throw Error(getErrorMessage('registryNotFound', 'Proposta'));

		const status = await this.proposalActivityStatus(proposal, true);
		await this.database.update({ status }, proposalId);
	}
}

export default ProposalService;