/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { ProposalUserPowerInterface } from '@/interfaces/ProposalUserPowerInterface';

class ProposalUserPowerDatabase extends Database {
	constructor() { 
		super();
	}

	async fetch(proposalId: number, userId: number): Promise<ProposalUserPowerInterface | null> {
		const rows: any = await this.query(`
			SELECT * FROM proposal_user_power WHERE proposal_id = ? AND user_account_id = ?;`, [proposalId, userId]);

		return rows[0]?.length > 0 ? rows[0][0] as ProposalUserPowerInterface : null;
	}

	async create(data: ProposalUserPowerInterface) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`INSERT INTO proposal_user_power SET ${mysqlBind};`, Object.values(data));
	}

}

export default ProposalUserPowerDatabase;
