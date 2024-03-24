import { getErrorMessage } from '@/helpers/response_collection';
import VoteDatabase from '@/database/VoteDatabase';
import { Vote } from '@/interfaces/VoteInterface';
import ProposalService from './ProposalService';
import ProposalUserPowerService from './ProposalUserPowerService';

class VoteService {
	private database: VoteDatabase;

	constructor() {
		this.database = new VoteDatabase();
	}

	async fetch(id: number): Promise<Vote | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id do voto'));

		return await this.database.fetch(id);
	}

	async fetchAll(): Promise<Array<Vote>> {
		return await this.database.fetchAll();
	}

	async fetchAllOfProposal(proposalId: number): Promise<Array<Vote>> {
		return await this.database.fetchAllOfProposal(proposalId);
	}

	async fetchByProposalAndUser(proposalId: number, userAccountId: number): Promise<Vote | null> {
		return await this.database.fetchByProposalAndUser(proposalId, userAccountId);
	}

	async create(data: Vote): Promise<number> {
		const proposalService = new ProposalService();

		if (!data.answer) throw Error(getErrorMessage('missingField', 'Resposta da proposta'));
		if (!data.proposal_id) throw Error(getErrorMessage('missingField', 'Id da proposta'));
		if (!data.user_account_id) throw Error(getErrorMessage('missingField', 'usuário que votou na proposta'));
		
		if(await proposalService.isClosed(data.proposal_id)) throw Error('Proposal is closed');
		const userProposalVote = await this.fetchByProposalAndUser(data.proposal_id, data.user_account_id);
		if(userProposalVote) throw Error('Already voted in proposal');

		const proposalUserService = new ProposalUserPowerService();
		const userGovernancePower = await proposalUserService.fetch(data.proposal_id, data?.user_account_id);

		if(!userGovernancePower?.power) throw Error(getErrorMessage('noGovernancePowerToVote'));
		const insertData: Vote = {
			answer: data.answer,
			user_power: userGovernancePower?.power,
			proposal_id: data.proposal_id,
			user_account_id: data.user_account_id
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result:any = await this.database.create(insertData);
		return result[0].insertId;
	}
}

export default VoteService;