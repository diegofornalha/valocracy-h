import ProposalUserPowerDatabase from '@/database/ProposalUserPowerDatabase';
import { getErrorMessage } from '@/helpers/response_collection';
import { ProposalUserPowerInterface } from '@/interfaces/ProposalUserPowerInterface';

class ProposalUserPowerService {
	private database: ProposalUserPowerDatabase;

	constructor() {
		this.database = new ProposalUserPowerDatabase();
	}

	async fetch(proposalId: number, userId: number): Promise<ProposalUserPowerInterface | null> {
		if (!proposalId) throw Error(getErrorMessage('missingField', 'Id da proposta'));
		if (!userId) throw Error(getErrorMessage('missingField', 'Id do usuário'));

		return await this.database.fetch(proposalId, userId);
	}

	async create(data: ProposalUserPowerInterface): Promise<number> {
		if (data?.power === undefined) throw Error(getErrorMessage('missingField', 'Poder do usuário'));
		if (data?.relative_power === undefined) throw Error(getErrorMessage('missingField', 'Poder relativo do usuário'));
		if (!data.proposal_id) throw Error(getErrorMessage('missingField', 'Proposta'));
		if (!data.user_account_id) throw Error(getErrorMessage('missingField', 'Usuário'));
		const insertData: ProposalUserPowerInterface = {
			power: data.power,
			relative_power: data.relative_power,
			proposal_id: data.proposal_id,
			user_account_id: data.user_account_id
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = await this.database.create(insertData);
		return result[0].insertId;
	}
}

export default ProposalUserPowerService;