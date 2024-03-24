/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vote } from '@/interfaces/VoteInterface';
import Database from './Database';
import { createBindParams } from '@/helpers/util';

export default class VoteDatabase extends Database {
    
	async fetch(id: number): Promise<Vote | null> {
		const rows: any = await this.query('SELECT * FROM vote WHERE id = ?;', [id]);

		return rows[0]?.length > 0 ? rows[0][0] as Vote : null;
	}

	async fetchAll(): Promise<Array<Vote>> {
		const rows: any = await this.query('SELECT * FROM vote ORDER BY id DESC;', []);

		return rows[0];
	}

	async fetchAllOfProposal(proposalId: number): Promise<Array<Vote>> {
		const rows: any = await this.query(`
            SELECT 
                t1.* 
            FROM vote t1 
                INNER JOIN proposal t2 ON t2.id = t1.proposal_id
            WHERE t2.id = ?
            ORDER BY id DESC;`, [proposalId]);

		return rows[0];
	}

	async fetchByProposalAndUser(proposalId: number, userAccountId: number): Promise<Vote | null> {
		const rows: any = await this.query(`
            SELECT 
                t1.* 
            FROM vote t1 
                INNER JOIN proposal t2 ON t2.id = t1.proposal_id
            WHERE t2.id = ? AND t1.user_account_id = ?
            ORDER BY id DESC;`, [proposalId, userAccountId]);

		return rows[0]?.length > 0 ? rows[0][0] as Vote : null;
	}

	async create(data: Vote) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`INSERT INTO vote SET ${mysqlBind};`, Object.values(data));
	}
}